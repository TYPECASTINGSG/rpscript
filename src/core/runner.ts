import fs from 'fs';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";

import {RpsParser} from '../antlr/grammar/RpsParser';
import {RpsLexer} from '../antlr/grammar/RpsLexer';

import {RpsMainListener} from '../antlr/RpsListener';
import {RpsContext} from '../antlr/RpsSymTable';

import {Deferred} from "ts-deferred";

export class Runner{
    config:any;
    constructor(){
        this.config = JSON.parse(fs.readFileSync(`${__dirname}/rpsconfig.default.json`,'utf8'));
    }

    compile (filepath:string) : Promise<RpsContext>{
        let content = fs.readFileSync(filepath,'utf-8');
    
        let parser = this.parseTree(content);
        let tree = parser.file();
    
        return this.exec(tree);
    }
    
    private exec (tree) :Promise<RpsContext>{
        let d = new Deferred<RpsContext>();
    
        let intentListener = new RpsMainListener(d);
    
        ParseTreeWalker.DEFAULT.walk(intentListener, tree);
    
        return d.promise;
     }
    
    
    execLine(line):Promise<any> {
        let parser = this.parseTree(line);
        let tree = parser.statement();
    
        return this.exec(tree);
    }

    private parseTree(input:string) :RpsParser {
        let inputStream = new ANTLRInputStream(input);
        let tokenStream = new CommonTokenStream( new RpsLexer(inputStream) );

        return new RpsParser(tokenStream);
    }

}