"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const antlr4ts_1 = require("antlr4ts");
const ParseTreeWalker_1 = require("antlr4ts/tree/ParseTreeWalker");
const RpsParser_1 = require("../antlr/grammar/RpsParser");
const RpsLexer_1 = require("../antlr/grammar/RpsLexer");
const RpsListener_1 = require("../antlr/RpsListener");
const ts_deferred_1 = require("ts-deferred");
class Runner {
    constructor() {
        this.config = JSON.parse(fs_1.default.readFileSync(`${__dirname}/rpsconfig.default.json`, 'utf8'));
    }
    compile(filepath) {
        let content = fs_1.default.readFileSync(filepath, 'utf-8');
        let parser = this.parseTree(content);
        let tree = parser.file();
        return this.exec(tree);
    }
    exec(tree) {
        let d = new ts_deferred_1.Deferred();
        let intentListener = new RpsListener_1.RpsMainListener(d);
        ParseTreeWalker_1.ParseTreeWalker.DEFAULT.walk(intentListener, tree);
        return d.promise;
    }
    execLine(line) {
        let parser = this.parseTree(line);
        let tree = parser.statement();
        return this.exec(tree);
    }
    parseTree(input) {
        let inputStream = new antlr4ts_1.ANTLRInputStream(input);
        let tokenStream = new antlr4ts_1.CommonTokenStream(new RpsLexer_1.RpsLexer(inputStream));
        return new RpsParser_1.RpsParser(tokenStream);
    }
}
exports.Runner = Runner;
