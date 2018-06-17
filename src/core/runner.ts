import fs from 'fs';
import {Logger} from './logger';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";

import {RPScriptParser} from '../antlr/grammar/RPScriptParser';
import {RPScriptLexer} from '../antlr/grammar/RPScriptLexer';
import {RPScriptListener} from '../antlr/grammar/RPScriptListener';

import {RpsTranspileListener,ErrorCollectorListener} from '../antlr/RpsListener';

import {Deferred} from "ts-deferred";

import { Linter, Configuration } from "tslint";
import { EventEmitter } from 'events';


export class Runner{
    config:any;
    runnerListener:EventEmitter;
    l:Logger;

    constructor(){
        this.config = JSON.parse(fs.readFileSync(`${__dirname}/rpsconfig.default.json`,'utf-8'));
        
        if(!fs.existsSync(this.config['outputDir'])) {
            fs.mkdirSync(this.config['outputDir']);
            fs.mkdirSync(this.config['outputDir']+'/logs');
        }

        this.l = Logger.getInstance();
    }

    async convertToTS (filepath:string) : Promise<any>{
        //read content from file
        let content = fs.readFileSync(filepath,'utf-8');

        //generate default parse tree
        let parser = this.parseTree(content);

        // this.addErrorListener(parser);
        
        let tree = parser.program();
    
        try{
            let output = await this.transpile(tree);
            let fileOutputPath = this.config['outputDir'] + '/'+ this.getFileName(filepath)+'.ts'; 
            
            //write to file
            fs.writeFileSync(`${fileOutputPath}`,output);

            return Promise.resolve(output);
        }catch(err) {
            return Promise.reject(err);
        }
        
    }

    async run (filepath:string) : Promise<any> {
        this.l.createRunnerLogger( this.getFileName(filepath) );

        let fullPath = `${process.cwd()}/${filepath}`;

        this.runnerListener = require(fullPath);

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
    
    linting (filepath:string) : any {

        const configurationFilename = "tsconfig.json";
        const options = {
            fix:false,
            formatter: "json",
            rulesDirectory: "customRules/",
            formattersDirectory: "customFormatters/"
        };
        
        const fileContents = fs.readFileSync(filepath, "utf8");
        const linter = new Linter(options);
        const configLoad = Configuration.findConfiguration(configurationFilename, filepath);
        
        linter.lint(filepath, fileContents, configLoad.results);
        
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

    private transpile (tree) :Promise<string>{
        let d = new Deferred<any>();
        let intentListener:RPScriptListener = new RpsTranspileListener(d);

        ParseTreeWalker.DEFAULT.walk(intentListener, tree);
        
        return d.promise;
     }
    
    private parseTree(input:string) :RPScriptParser {
        let inputStream = new ANTLRInputStream(input);
        let tokenStream = new CommonTokenStream( new RPScriptLexer(inputStream) );

        return new RPScriptParser(tokenStream);
    }

}