import fs from 'fs';
import {Logger} from './logger';
import R from 'ramda';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";

import {RPScriptParser} from '../antlr/grammar/RPScriptParser';
import {RPScriptLexer} from '../antlr/grammar/RPScriptLexer';
import {RPScriptListener} from '../antlr/grammar/RPScriptListener';

import {RpsTranspileListener,ErrorCollectorListener} from '../antlr/RpsListener';

import {Deferred} from "ts-deferred";

import { Linter, Configuration, LintResult } from "tslint";
import { EventEmitter } from 'events';

var _eval = require('eval');
import {RpsContext} from './actions';
import * as api from './actions';
import {TranspileContent} from '../antlr/RpsListener';

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

    // async repl () {
    //     this.replSvr = repl.start({
    //         prompt:'rpscript action > ',
    //         eval: async (cmd, context, filename, callback) => {
    //             cmd = cmd.replace(/(\r\n\t|\n|\r\t)/gm,"");
        
    //             let tsContent = await this.compile(cmd,true);

    //             let output = await _eval(tsContent,context,true);
                
    //             callback(null, output.$RESULT);
    //         }});
    
    //     this.initializeContext(this.replSvr.context);
    
    //     this.replSvr.on('reset', this.initializeContext);
    // }


    //involve 2 steps : convertToTS , then Linting
    async compile (filepath:string, rpsContent:string, isRepl:boolean) :Promise<string>{
        let result = await Runner.convertToTS(filepath, rpsContent,isRepl);
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

    static async convertToTS(filepath:string, content:string, isRepl:boolean) : Promise<TranspileContent> {
        try{
            let parser = this.parseTree(content);

            let output = await this.transpile(filepath, parser.program() , isRepl);

            return Promise.resolve(output);
        }catch(err) {
            return Promise.reject(err);
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

    private addErrorListener (parser) {
        parser.removeErrorListeners();
        parser.addErrorListener(new ErrorCollectorListener);
    }

    private getFileName (filepath:string) :string {
        let index = filepath.lastIndexOf('/');
        let dotIndex = filepath.lastIndexOf('.');
        
        return filepath.substring(index+1,dotIndex);
    }

    private static transpile (filepath:string, tree, isRepl:boolean) :Promise<TranspileContent>{
        let d = new Deferred<any>();
        let intentListener:RPScriptListener = new RpsTranspileListener(d,filepath);

        ParseTreeWalker.DEFAULT.walk(intentListener, tree);
        
        return d.promise;
     }
    
    private static parseTree(input:string) :RPScriptParser {
        let inputStream = new ANTLRInputStream(input);
        let tokenStream = new CommonTokenStream( new RPScriptLexer(inputStream) );

        return new RPScriptParser(tokenStream);
    }

}

