import { AnonFnContext, ParamContext, OptContext, CommentContext,SingleActionContext, PipeActionsContext, BlockContext, IfStatementContext, SwitchStatementContext, NamedFnContext, ActionContext, ParamListContext, OptListContext, VariableContext, LiteralContext } from "../antlr/grammar/RPScriptParser";
import R from 'ramda';

export class Translator {
    importSection:string;
    globalSection:string;
    mainSection:string;
    fnSection:string;
    runSection:string;

    content:string;

    readonly globalEventDeclare:string = `module.exports = new EventEmitter();`;
    readonly mainSectionStart:string = `
async function main(){
    module.exports.emit('runner.start');
    `;
    readonly mainSectionEnd:string = `
    module.exports.emit('runner.end');
}`;

    readonly runSect:string = `
$CONTEXT.event.on ('action', (...params) => module.exports.emit('action',params));
setTimeout(main, 500);
    `

    readonly startBlock:string = `{`;
    readonly endBlock:string = `}`;

    constructor(){
        this.content = "";
        this.importSection = "";
        this.globalSection = "";
        this.mainSection = "";
        this.fnSection = "";
        this.runSection = "";
    }

    combineContent () {
        this.content += this.importSection;
        this.content += this.globalSection;
        
        this.content += this.mainSection;
        this.content += this.fnSection;

        this.content += this.runSection;
    }



    startAction (ctx:ActionContext) :string{
        let actionStr:string = "";
        let keyword = Translator.parseAction(ctx.WORD().text);
        
        actionStr = `
    $CONTEXT.$RESULT = await ${keyword} ($CONTEXT , ${Translator.parseOpt(ctx.optList().opt())}`;
        if(ctx.paramList().param().length > 0)
            actionStr += ' , '+Translator.parseParams(ctx.paramList().param());

        return actionStr;
    }
    closeAction = (ctx:ActionContext) : string => ");\n"

    appendComma () {this.content += ' , ';}

    genComment (ctx:CommentContext) :string { return ctx.text.trim().replace(';','//') + "\n"; }


    private static capitalize(word:string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    private static parseParams (params:ParamContext[]):string{
        return R.map(param => Translator.processVar(param.text), params).join(' , ');
    }
    private static parseOpt (opts:OptContext[]):string{
        let obj = {};
        R.forEach(x => {
            obj[x.optName().text] = x.literal().text
        } , opts);
        
        return JSON.stringify(obj);
    }

    private static processVar (param:string) {
        
        if(param.trim().indexOf('$')===0){
            if("$RESULT" === param.trim()) return "$CONTEXT.$RESULT";
            else return `$CONTEXT.variables.${param}`;
        } else return param;
    }

    
    // genIfStatement (ctx:IfStatementContext) {
    //     let expr = ctx.singleExpression().text;
    //     this.content += `if ( ${expr} )`;
    // }

    // genSwitchStatement (ctx:SwitchStatementContext) {
    //     this.content += 
    //         ctx.text.trim().replace(/@/g,'') + "\n";
    // }

    genNamedFn (ctx:NamedFnContext) : string{
        let name = ctx.WORD().text;
        let variables = R.map(node=>node.text,  ctx.VARIABLE()).join(',');
        
        return `async function ${name}( ${variables} ) `;
    }
    genAnonFn (ctx:AnonFnContext) {
        let variables = R.map(node=>node.text,  ctx.VARIABLE()).join(',');
        
        this.content += `async function( ${variables} ) `;
    }


    static parseAction (rawKeyword:string) : string{
        let keyword = "";
        if(rawKeyword.indexOf('.') < 0){
            keyword = "api." + Translator.capitalize(rawKeyword);
        }
        else {
            let kw = rawKeyword.split(".");
            keyword = "api."+kw[0]+"."+Translator.capitalize(kw[1]);
        }

        return keyword;
    }
}