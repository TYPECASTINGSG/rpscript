import { AnonFnContext, ParamContext, OptContext, CommentContext,SingleActionContext, PipeActionsContext, BlockContext, IfStatementContext, SwitchStatementContext, NamedFnContext, ActionContext, ParamListContext, OptListContext, VariableContext, LiteralContext } from "../antlr/grammar/RPScriptParser";
import R from 'ramda';

export class Translator {

    content:string;

    constructor(){
        this.content = "";
    }

    genBoilerHeader () {
        this.content = `
import rps from 'rpscript-api';
import {RpsContext, common, desktop, chrome, file, functional, test } from 'rpscript-api';
import { EventEmitter } from 'events';

module.exports = new EventEmitter();

let $CONTEXT = new RpsContext();
let $RESULT = null;


async function main(){
    module.exports.emit('runner.start');
        `.trim()+'\n\n';
    }

    appendBottom () {
        this.content += `
    module.exports.emit('runner.end');
}
$CONTEXT.event.on ('action', (...params) => module.exports.emit('action',params));
setTimeout(main, 500);
`;
    }

    genBlock (ctx:BlockContext) {this.content += "{\n";}
    closeBlock (ctx:BlockContext) { this.content += "}\n"; }

    genPipeline (ctx:PipeActionsContext){}

    genSingleAction (ctx:SingleActionContext) {}

    genAction (ctx:ActionContext) :void{
        //TODO: if WORD has single . , do not append rps
        let keyword = this.capitalize(ctx.WORD().text);

        if(ctx.WORD().text.indexOf('.') < 0) keyword = 'rps.'+keyword;
        
        this.content += `\t${ keyword } ( $CONTEXT ,`;
        
        this.content += this.parseOpt(ctx.optList().opt())+' , ';
        this.content += this.parseParams(ctx.paramList().param());

    }
    closeAction (ctx:ActionContext) : void {this.content += ");\n";}
    // genOptList ( ctx:OptListContext) : void {this.content += this.parseOpt( ctx.opt() );}
    
    // genVariable (ctx:VariableContext) {this.content += ctx.text;}
    // genLiteral (ctx:LiteralContext) {this.content += ctx.text;}

    appendComma () {this.content += ' , ';}


    private capitalize(word:string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    private parseParams (params:ParamContext[]):string{
        return R.map(param => param.text, params).join(' , ');
    }
    private parseOpt (opts:OptContext[]):string{
        let obj = {};
        R.forEach(x => {
            obj[x.optName().text] = x.literal().text
        } , opts);
        
        return JSON.stringify(obj);
    }

    genComment (ctx:CommentContext) :void { this.content += ctx.text.trim().replace(';','//') + "\n"; }

    genIfStatement (ctx:IfStatementContext) {
        let expr = ctx.singleExpression().text;
        this.content += `if ( ${expr} )`;
    }

    genSwitchStatement (ctx:SwitchStatementContext) {
        this.content += 
            ctx.text.trim().replace(/@/g,'') + "\n";
    }

    genNamedFn (ctx:NamedFnContext) {
        let name = ctx.WORD().text;
        let variables = R.map(node=>node.text,  ctx.VARIABLE()).join(',');
        
        this.content += `function ${name}( ${variables} ) `;
    }
    genAnonFn (ctx:AnonFnContext) {
        let variables = R.map(node=>node.text,  ctx.VARIABLE()).join(',');
        
        this.content += `function( ${variables} ) `;
    }
}