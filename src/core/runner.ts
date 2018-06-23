import fs from 'fs';
import {Logger} from './logger';
import R from 'ramda';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";

import {RPScriptParser} from '../antlr/grammar/RPScriptParser';
import {RPScriptLexer} from '../antlr/grammar/RPScriptLexer';
import {RpsTranspileLexer} from '../antlr/RpsTranspileLexer';
import {RPScriptListener} from '../antlr/grammar/RPScriptListener';

import {RpsTranspileListener} from '../antlr/RpsListener';
import {ErrorCollectorListener,RpsErrorStrategy} from '../antlr/RpsErrorHandling';

import {Deferred} from "ts-deferred";

import { Linter, Configuration, LintResult } from "tslint";
import { EventEmitter } from 'events';

var _eval = require('eval');
import {RpsContext} from './actions';
import * as api from './actions';
import {TranspileContent} from '../antlr/RpsListener';

import {InvalidKeywordException} from '../antlr/InvalidKeywordException';
// import {Translator} from './translator';

export interface RpsMainConfig{
    outputDir?:string;
    skipLinting?:boolean;
    skipOutputTS?:boolean;
    skipRun?:boolean;
}

export class Runner{
    config:RpsMainConfig;
    runnerListener:EventEmitter;
    l:Logger;

    replSvr;

    constructor(config:RpsMainConfig){
        let defaultConfig = JSON.parse(fs.readFileSync(`${__dirname}/rpsconfig.default.json`,'utf-8'));
        this.config = R.merge(defaultConfig, config);
        
        
        if(!fs.existsSync(this.config['outputDir'])) {
            fs.mkdirSync(this.config['outputDir']);
            fs.mkdirSync(this.config['outputDir']+'/logs');
        }

        this.l = Logger.getInstance();
    }

    //if skip run, return string, also return eventemitter
    //process: 1. compile to TS (antlr) , 2. linting , 3. eval (require)
    // compile time handling 3 steps
    //run time handling
    async execute (filepath:string) :Promise<EventEmitter|string>{
        let rpsContent = fs.readFileSync(filepath,'utf8');

        let tsContent = await this.compile(filepath,rpsContent,false);
        let context = this.initializeContext({});

        if(!this.config.skipOutputTS) fs.writeFileSync('.rpscript/temp.ts',tsContent);

        if(this.config.skipRun) return Promise.resolve(tsContent);

        this.runnerListener = await _eval(tsContent,context,true);

        this.l.createRunnerLogger( this.getFileName(filepath) );


        this.runnerListener.on('runner.start', (...params) => {
            this.l.runnerLogger.info('started');
        });
        this.runnerListener.on('runner.end', (...params) => {
            this.l.runnerLogger.info('ended');
        });
        this.runnerListener.on('action', (...params) => {
            this.l.runnerLogger.info(`action : ${params}`);
        });

        return Promise.resolve(this.runnerListener);
    }



    //involve 2 steps : convertToTS , then Linting
    async compile (filepath:string, rpsContent:string, isRepl:boolean) :Promise<string>{
        let result = await this.convertToTS(filepath, rpsContent, isRepl);
        let tsContent = result.fullContent;
        
        if(!this.config.skipLinting) {
            let lintResult = this.linting(tsContent);
        
            this.printLintingResult(lintResult);

            if(lintResult.errorCount>0)
                return Promise.reject(lintResult);
        }
        
        return Promise.resolve(tsContent);
    }

    printLintingResult (result:LintResult) {
        // console.log(result);
    }

    initializeContext(context) {
        context.api = api;
        context.RpsContext = RpsContext;
        context.EventEmitter = EventEmitter;
    
        context.$CONTEXT = new RpsContext();
        context.$RESULT = null;

        return context;
    }

    async convertToTS(filepath:string, content:string, isRepl:boolean) : Promise<TranspileContent> {
        let d = new Deferred<TranspileContent>();

        let inputStream = new ANTLRInputStream(content);
        let lexer = new RpsTranspileLexer(inputStream);

        // lexer.removeErrorListeners();

        let tokenStream = new CommonTokenStream(lexer);
        let parser = new RPScriptParser(tokenStream);

        // DEPRECATED : parser.errorHandler = new RpsErrorStrategy;

        // parser.removeErrorListeners();
        parser.addErrorListener(new ErrorCollectorListener);

        try{
            let intentListener:RPScriptListener = new RpsTranspileListener(d,filepath,parser);
            let context = parser.program();
    
            ParseTreeWalker.DEFAULT.walk(intentListener, context);

            return d.promise;
        }catch(err){
            if(err instanceof InvalidKeywordException)
                console.error(err+' : invalid keyword');
            else
                console.error('some other error');
        }
    }

    
    linting (tsContent:string) : LintResult {
        const configurationFilename = "tsconfig.json";
        const options = {
            fix:false,
            formatter: "json",
            rulesDirectory: "customRules/",
            formattersDirectory: "customFormatters/"
        };
        
        const linter = new Linter(options);
        const configLoad = Configuration.findConfiguration(configurationFilename, "");
        
        linter.lint("", tsContent, configLoad.results);
        
        const result = linter.getResult();

        return result;
    }


    private getFileName (filepath:string) :string {
        let index = filepath.lastIndexOf('/');
        let dotIndex = filepath.lastIndexOf('.');
        
        return filepath.substring(index+1,dotIndex);
    }

}

