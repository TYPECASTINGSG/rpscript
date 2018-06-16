import { AnonFnContext, ParamContext, OptContext, CommentContext,SingleActionContext, PipeActionsContext, BlockContext, IfStatementContext, SwitchStatementContext, NamedFnContext, ActionContext, ParamListContext, OptListContext, VariableContext, LiteralContext } from "../antlr/grammar/RPScriptParser";
import R from 'ramda';

export class Translator {

    content:string;

    constructor(){
        this.content = "";
    }

    genBoilerHeader () {
        this.content = `
            import * from 'rpscript-api';
        `.trim()+'\n\n';
    }

    genBlock (ctx:BlockContext) {
        this.content += "{\n";
    }
    closeBlock (ctx:BlockContext) {
        this.content += "}\n";
    }

    genPipeline (ctx:PipeActionsContext){

    }

    genSingleAction (ctx:SingleActionContext) {}
    genAction (ctx:ActionContext) :void{
        this.content += `${ctx.WORD().text} (`;
        // this.content += `
        //     ${ctx.WORD().text}( ${this.parseParams(ctx.param())} , ${this.parseOpt(ctx.opt())} )
        // `.trim() + '\n';
    }
    closeAction (ctx:ActionContext) : void {
        this.content += ");\n";
    }
    genOptList ( ctx:OptListContext) : void {
        this.content += this.parseOpt( ctx.opt() );
    }
    appendComma () {
        this.content += ' , ';
    }
    genVariable (ctx:VariableContext) {
        this.content += ctx.text;
    }
    genLiteral (ctx:LiteralContext) {
        this.content += ctx.text;
    }

    private parseParams (params:ParamContext[]):string{
        return R.map(param => param.text, params).join();
    }
    private parseOpt (opts:OptContext[]):string{
        let obj = {};
        R.forEach(x => {
            obj[x.optName().text] = x.literal().text
        } , opts);
        
        return JSON.stringify(obj);
    }

    genComment (ctx:CommentContext) :void {
        this.content += 
            ctx.text.trim().replace(';','//') + "\n";
    }

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