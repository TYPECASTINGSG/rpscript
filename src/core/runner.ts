import fs from 'fs';
import {Logger} from './logger';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";

import {RPScriptParser} from '../antlr/grammar/RPScriptParser';
import {RPScriptLexer} from '../antlr/grammar/RPScriptLexer';
import {RPScriptListener} from '../antlr/grammar/RPScriptListener';

import {RpsTranspileListener,RpsReplListener,ErrorCollectorListener} from '../antlr/RpsListener';

import {Deferred} from "ts-deferred";

import { Linter, Configuration } from "tslint";
import { EventEmitter } from 'events';

var _eval = require('eval');
import rps from 'rpscript-api';
import {RpsContext, common, desktop, chrome, file, functional, test } from 'rpscript-api';
import repl from 'repl';


export class Runner{
    config:any;
    runnerListener:EventEmitter;
    l:Logger;

    replSvr;

    constructor(){
        this.config = JSON.parse(fs.readFileSync(`${__dirname}/rpsconfig.default.json`,'utf-8'));
        
        if(!fs.existsSync(this.config['outputDir'])) {
            fs.mkdirSync(this.config['outputDir']);
            fs.mkdirSync(this.config['outputDir']+'/logs');
        }

        this.l = Logger.getInstance();
    }

    async execute (filepath:string) :Promise<EventEmitter>{
        let rpsContent = fs.readFileSync(filepath,'utf8');

        let tsContent = await this.compile(rpsContent,false);
        let context = this.initializeContext({});

        fs.writeFileSync('.rpscript/temp.ts',tsContent);

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

    async repl () {
        this.replSvr = repl.start({
            prompt:'rpscript action > ',
            eval: async (cmd, context, filename, callback) => {
                cmd = cmd.replace(/(\r\n\t|\n|\r\t)/gm,"");
        
                let tsContent = await this.compile(cmd,true);

                let output = await _eval(tsContent,context,true);
                
                callback(null, output.$RESULT);
            }});
    
        this.initializeContext(this.replSvr.context);
    
        this.replSvr.on('reset', this.initializeContext);
    
        // this.replSvr.defineCommand('actions', function actions() {
        //   console.log('List all actions');
        // });
    }


    //involve 2 steps : convertToTS , then Linting
    async compile (rpsContent:string, isRepl:boolean) :Promise<string>{
        let tsContent = await this.convertToTS(rpsContent,isRepl);
        
        let lintResult = this.linting(tsContent);
        
        if(lintResult.error>0)
            return Promise.reject(lintResult);

        return Promise.resolve(tsContent);
    }

    initializeContext(context) {
        context.rps = rps;
        context.RpsContext = RpsContext;
        context.common = common;
        context.desktop = desktop;
        context.chrome = chrome;
        context.file = file;
        context.functional = functional;
        context.test = test;
        context.EventEmitter = EventEmitter;
    
        context.$CONTEXT = new RpsContext();
        context.$RESULT = null;

        return context;
    }

    async convertToTS(content:string, isRepl:boolean) : Promise<string> {
        try{
            let parser = this.parseTree(content);

            let output = await this.transpile(parser.program() , isRepl);

            return Promise.resolve(output);
        }catch(err) {
            return Promise.reject(err);
        }
    }

    
    linting (tsContent:string) : any {

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

    private transpile (tree, isRepl:boolean) :Promise<string>{
        let d = new Deferred<any>();
        let intentListener:RPScriptListener = isRepl ? new RpsReplListener(d) : new RpsTranspileListener(d);

        ParseTreeWalker.DEFAULT.walk(intentListener, tree);
        
        return d.promise;
     }
    
    private parseTree(input:string) :RPScriptParser {
        let inputStream = new ANTLRInputStream(input);
        let tokenStream = new CommonTokenStream( new RPScriptLexer(inputStream) );

        return new RPScriptParser(tokenStream);
    }

}

