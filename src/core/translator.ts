import { AnonFnContext, ParamContext, OptContext, CommentContext,SingleActionContext, PipeActionsContext, BlockContext, IfStatementContext, SwitchStatementContext, NamedFnContext, ActionContext, ParamListContext, OptListContext, VariableContext, LiteralContext } from "../antlr/grammar/RPScriptParser";
import R from 'ramda';

export class Translator {

    content:string;

    constructor(){
        this.content = "";
    }

    genBoilerHeader () {
        this.content = `
module.exports = new EventEmitter();

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
        let keyword = Translator.parseAction(ctx.WORD().text);
        
        this.content += `\t$CONTEXT.$RESULT = `;
        this.content += `${ keyword } ( $CONTEXT ,`;
        this.content += Translator.parseOpt(ctx.optList().opt());
        
        if(ctx.paramList().param().length > 0)
            this.content += ' , '+Translator.parseParams(ctx.paramList().param());

    }
    closeAction (ctx:ActionContext) : void {this.content += ");\n";}
    // genOptList ( ctx:OptListContext) : void {this.content += this.parseOpt( ctx.opt() );}
    
    // genVariable (ctx:VariableContext) {this.content += ctx.text;}
    // genLiteral (ctx:LiteralContext) {this.content += ctx.text;}

    appendComma () {this.content += ' , ';}


    private static capitalize(word:string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    private static parseParams (params:ParamContext[]):string{
        return R.map(param => param.text, params).join(' , ');
    }
    private static parseOpt (opts:OptContext[]):string{
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

    static genReplParams (cmd:string):string[] {
        let cmds = cmd.split(' ');
        let remainCmds = cmds.slice(1);
        
        let param = R.filter(cmd => cmd.indexOf('--') !== 0, remainCmds);

        return R.map(cmd => cmd.replace(/"/g,""),param);
    }
    static genReplOpts (cmd:string):Object {
        let cmds = cmd.split(' ');
        let remainCmds = cmds.slice(1);
        let optList = R.filter(cmd => cmd.indexOf('--') == 0, remainCmds);

        let obj = {};
        R.forEach(x => {
            let res = x.substring(2).split('=');
            let name = res[0].trim(); let val:any = true;

            if(res.length > 1) val = res[1].trim();
            obj[name] = val;
        } , optList);

        return obj;
    }
    static genActions (cmd:string): string[] {
        let cmds = cmd.split(' ');
        let keyword = cmds[0];

        let module = '', action = '';

        if(keyword.indexOf('.') < 0){
            module = 'rps'; action = this.capitalize(keyword);
        }
        else {
            let result = keyword.split('.');
            module = result[0];
            action = this.capitalize(result[1]);
        }

        return [module,action];
    }
    static parseAction (rawKeyword:string) : string{
        let keyword = "";
        if(rawKeyword.indexOf('.') < 0){
            keyword = "rps." + Translator.capitalize(rawKeyword);
        }
        else {
            let kw = rawKeyword.split(".");
            keyword = kw[0]+"."+Translator.capitalize(kw[1]);
        }

        return keyword;
    }
}