"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const antlr4ts_1 = require("antlr4ts");
const ParseTreeWalker_1 = require("antlr4ts/tree/ParseTreeWalker");
const RPScriptParser_1 = require("../antlr/grammar/RPScriptParser");
const RPScriptLexer_1 = require("../antlr/grammar/RPScriptLexer");
const RpsListener_1 = require("../antlr/RpsListener");
var tsc = require('typescript-compiler');
const ts_deferred_1 = require("ts-deferred");
class Runner {
    constructor() {
        this.config = JSON.parse(fs_1.default.readFileSync(`${__dirname}/rpsconfig.default.json`, 'utf-8'));
        if (!fs_1.default.existsSync(this.config['outputDir']))
            fs_1.default.mkdirSync(this.config['outputDir']);
    }
    compile(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = fs_1.default.readFileSync(filepath, 'utf-8');
            let parser = this.parseTree(content);
            let tree = parser.program();
            let output = yield this.exec(tree);
            fs_1.default.writeFileSync(`${this.config['outputDir']}/output.ts`, output);
            return Promise.resolve(output);
        });
    }
    run(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            let resp = require(filepath);
        });
    }
    tsc(filepath) {
        return tsc.compile(filepath);
    }
    exec(tree) {
        let d = new ts_deferred_1.Deferred();
        let intentListener = new RpsListener_1.RpsMainListener(d);
        ParseTreeWalker_1.ParseTreeWalker.DEFAULT.walk(intentListener, tree);
        return d.promise;
    }
    parseTree(input) {
        let inputStream = new antlr4ts_1.ANTLRInputStream(input);
        let tokenStream = new antlr4ts_1.CommonTokenStream(new RPScriptLexer_1.RPScriptLexer(inputStream));
        return new RPScriptParser_1.RPScriptParser(tokenStream);
    }
}
exports.Runner = Runner;
