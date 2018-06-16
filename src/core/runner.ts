import fs from 'fs';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";

import {RPScriptParser} from '../antlr/grammar/RPScriptParser';
import {RPScriptLexer} from '../antlr/grammar/RPScriptLexer';
import {RPScriptListener} from '../antlr/grammar/RPScriptListener';

import {RpsMainListener} from '../antlr/RpsListener';
import {RpsContext} from '../antlr/RpsSymTable';

import {Deferred} from "ts-deferred";

export class Runner{
    config:any;
    constructor(){
        this.config = JSON.parse(fs.readFileSync(`${__dirname}/rpsconfig.default.json`,'utf-8'));
        
        if(!fs.existsSync(this.config['outputDir']))
            fs.mkdirSync(this.config['outputDir']);
    }

    async compile (filepath:string) : Promise<any>{
        let content = fs.readFileSync(filepath,'utf-8');
    
        let parser = this.parseTree(content);
        let tree = parser.program();
    
        let output = await this.exec(tree);

        fs.writeFileSync(`${this.config['outputDir']}/output.ts`,output);

        return Promise.resolve(output);
    }

    private exec (tree) :Promise<any>{
        let d = new Deferred<any>();
    
        let intentListener:RPScriptListener = new RpsMainListener(d);
    
        ParseTreeWalker.DEFAULT.walk(intentListener, tree);
    
        return d.promise;
     }
    

    private parseTree(input:string) :RPScriptParser {
        let inputStream = new ANTLRInputStream(input);
        let tokenStream = new CommonTokenStream( new RPScriptLexer(inputStream) );

        return new RPScriptParser(tokenStream);
    }

}