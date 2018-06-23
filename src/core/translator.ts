// import { AnonFnContext, ParamContext, OptContext, CommentContext,SingleActionContext, PipeActionsContext, BlockContext, IfStatementContext, SwitchStatementContext, NamedFnContext, ActionContext, ParamListContext, OptListContext, VariableContext, LiteralContext } from "../antlr/grammar/RPScriptParser";
// import R from 'ramda';
// import { resolve } from "dns";
// import { ParserRuleContext } from "antlr4ts";

// interface IncludeContent {
//     dir:string;
//     content:string;
//     translation?:Translator;
// }

// export class ImportSection{
//     content:string;
//     constructor(){this.content="";}
// }
// export class GlobalSection {
//     readonly globalEventDeclare:string = `module.exports = new EventEmitter();`;
//     content:string;
//     constructor(){
//         this.content = this.globalEventDeclare;
//     }
// }
// export class MainSection {
//     actions?:ActionSection[];
//     readonly mainSectionStart:string = `
//     async function main(){
//         module.exports.emit('runner.start');
//         `;
//     readonly mainSectionEnd:string = `
//         module.exports.emit('runner.end');
//     }`;
//     content:string;
//     actionSections:ActionSection[];
    
//     constructor(){
//         this.content = this.mainSectionStart;
//         this.actionSections = [];
//     }

//     addAction(action:ActionSection):void{
//         this.actions.push(action);
//     }
// }
// export class NameFn {
//     name:string;
//     content:string;
//     actions:ActionSection[];
//     constructor(name:string,vars:string[]){
        
//         this.name=name;
//         this.content=`async function ${name}( ${vars.join(',')} ) `;
//         this.actions = [];
//     }
//     addAction(action:ActionSection){
//         this.actions.push(action);
//     }
// }
// export class FnSection {
//     namedFunctions:NameFn[];

//     constructor(){
//         this.namedFunctions = [];
//     }

//     addNamedFn(namedFn:NameFn):void{
//         this.namedFunctions.push(namedFn);
//     }
//     newNamedFn(fnName:string,vars:string[]):void{
//         this.namedFunctions.push(new NameFn(fnName,vars));
//     }
//     appendStartBlock(fnName:string){
//         let f = R.find(fn => fn.name===fnName , this.namedFunctions);
//         f.content += "{";
//     }
//     appendEndBlock(fnName:string){
//         let f = R.find(fn => fn.name===fnName , this.namedFunctions);
//         f.content += "}";
//     }
//     addAction(fnName:string,action:ActionSection):void {
//         let f = R.find(fn => fn.name===fnName , this.namedFunctions);
//         f.addAction(action);
//     }

//     generateContent () :string {
//         return R.map((fn)=>fn.content, this.namedFunctions).join('\n');
//     }
// }
// export class RunSection {
//     readonly runSect:string = `
//     $CONTEXT.event.on ('action', (...params) => {
//         module.exports.emit('action',params);
//         //TODO: if 'action end' , $CONTEXT.$RESULT = params[params.length-1]
//     });
//     setTimeout(main, 500);
//         `
//     content:string;
//     constructor(){
//         this.content = this.runSect;
//     }
// }
// export class ActionSection {

//     // paramList:string|number|ActionSection[]
//     paramList:any[];
//     optList:Object;

//     startAction (ctx:ActionContext) :string{
//         let actionStr:string = "";
//         let keyword = this.parseAction(ctx.WORD().text);
        
//         actionStr = `
//     await ${keyword} ($CONTEXT , ${this.parseOpt(ctx.optList().opt())}`;

//         return actionStr;
//     }
//     closeAction (ctx:ActionContext) : string { 
//         let actionStr = "";
//         if(ctx.paramList().param().length > 0)
//             actionStr += ' , '+this.parseParams(ctx.paramList().param());

//         actionStr+=")\n";
//         return actionStr;
//     }

//     private parseParams (params:ParamContext[]):string{
//         return R.map(param => this.processArg(param), params).join(' , ');
//     }
//     private parseOpt (opts:OptContext[]):string{
//         let obj = {};
//         R.forEach(x => {
//             obj[x.optName().text] = x.literal().text
//         } , opts);
        
//         return JSON.stringify(obj);
//     }
//     private static capitalize(word:string): string {
//         return word.charAt(0).toUpperCase() + word.slice(1);
//     }


//     private processParams (pList:any[]) {
//         R.map(p=>{
//             if(p instanceof ActionSection) {
//                 if(p.paramList has no ActionSection)
//                     return this.parseActionWOAction(p.paramList);
//                 else
//                     return this.processParams(p.paramList);
//             }
//             else return p;
//         }, pList);

//         // let paramContext = param.getChild(0).constructor.name;
//         // if(paramContext === 'ActionContext'){
//         //     return "";
//         // }else if(param.text.trim().indexOf('$')===0){
//         //     if("$RESULT" === param.text.trim()) return "$CONTEXT.$RESULT";
//         //     else if(Translator.hasParent(param,'NamedFnContext')) return param.text;
//         //     else return `$CONTEXT.variables.${param.text}`;
//         // } else return param.text;
//     }
//     private processActionWOAction(action:ActionSection){
//         return `${action.}`
//     }

//     private processArg (param:ParamContext) {
//         let paramContext = param.getChild(0).constructor.name;
//         if(paramContext === 'ActionContext'){
//             return "";
//         }else if(param.text.trim().indexOf('$')===0){
//             if("$RESULT" === param.text.trim()) return "$CONTEXT.$RESULT";
//             else if(Translator.hasParent(param,'NamedFnContext')) return param.text;
//             else return `$CONTEXT.variables.${param.text}`;
//         } else return param.text;
//     }
//     static parseAction (rawKeyword:string) : string{
//         let keyword = "";
//         if(rawKeyword.indexOf('.') < 0){
//             keyword = "api." + this.capitalize(rawKeyword);
//         }
//         else {
//             let kw = rawKeyword.split(".");
//             keyword = "api."+kw[0]+"."+this.capitalize(kw[1]);
//         }

//         return keyword;
//     }
// }

// export class Translator {
//     importSection:ImportSection;
//     globalSection:GlobalSection;
//     mainSection:MainSection;
//     fnSection:FnSection;
//     runSection:RunSection;

//     filepath:string;

//     includeContent:IncludeContent[];

//     content:string;

//     constructor(filepath:string){
//         this.importSection = new ImportSection;
//         this.globalSection = new GlobalSection;
//         this.mainSection = new MainSection;
//         this.fnSection = new FnSection;
//         this.runSection = new RunSection;

//         this.includeContent = [];
//         this.content = "";

//         this.filepath = filepath;
//     }

//     async includeTranslators () {
//         let trans = await this.getAllIncludeContents();

//         trans.forEach(tran => {
//             R.forEach(
//                 (namedFn)=>this.fnSection.addNamedFn(namedFn),
//                 tran.fnSection.namedFunctions);
//         });
//     }

//     async resolveContent() : Promise<string> {
//         this.content += this.importSection.content;
//         this.content += this.globalSection.content;

//         this.content += this.mainSection.mainSectionStart;

//         this.content += this.mainSection.content;

//         this.content += this.mainSection.mainSectionEnd;

//         this.content += this.fnSection.generateContent();

//         this.content += this.runSection;

//         return this.content;
//     }

//     // addMainStartBlock(){}
//     // addMainEndBlock(){}
//     addFnStartBlock(fnName:string){
//         this.fnSection.appendStartBlock(fnName);
//     }
//     addFnEndBlock(fnName:string){
//         this.fnSection.appendEndBlock(fnName);
//     }

//     addFnAction(fnName:string, ctx:ActionContext){

//     }
//     addMainAction(ctx:ActionContext){
//         this.mainSection.addAction
//     }
//     closeFnAction(fnName:string,ctx:ActionContext){

//     }
//     closeMainAction(ctx:ActionContext){

//     }

//     addNamedFn(ctx:NamedFnContext) : void {
//         let vars = R.map(v=>v.text, ctx.VARIABLE());
//         this.fnSection.newNamedFn(ctx.WORD().text,vars);
//     }



//     genAnonFn (ctx:AnonFnContext): string {
//         let variables = R.map(node=>node.text,  ctx.VARIABLE()).join(',');
        
//         return `async function( ${variables} ) `;
//     }

//     addInclude(dir:string,content:string) {
//         this.includeContent.push({dir,content});
//     }
//     removeInclude(dir:string) {
//         this.includeContent = 
//             R.filter( incl => incl.dir !== dir, this.includeContent);
//     }
//     updateIncludeTranslator(dir:string, trans:Translator) {
//         let t = R.find(R.propEq('dir', dir))(this.includeContent);
//         t.translation = trans;
//     }
//     private hasAllIncludeCompleted(): boolean{
//         return R.all( (incl) => !!incl.translation, this.includeContent);
//     }

//     includeInterval = null;
//     getAllIncludeContents () :Promise<Translator[]>{
//         return new Promise((resolve,reject) => {
//             this.includeInterval = setInterval( () => {
//                 if(this.hasAllIncludeCompleted()) {
//                     clearInterval(this.includeInterval);
//                     resolve(R.map( incl => incl.translation, this.includeContent));
//                 } 
//             },100);
//         })
//     }



//     static hasParent(ctx:ParserRuleContext,parentName:string) : boolean{
//         let ctxTemp:any = ctx;
//         let isFnParent:boolean = false;
//         while (ctxTemp){
//           if(parentName === ctxTemp.constructor.name){
//             isFnParent = true;
//             break;
//           }
//           ctxTemp = ctxTemp.parent;
//         }
//         return isFnParent;
//     }
// }