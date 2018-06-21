import {Deferred} from "ts-deferred";
import {Logger} from '../core/logger';

import {ANTLRErrorListener,Recognizer,RecognitionException} from 'antlr4ts';

import {RPScriptListener} from './grammar/RPScriptListener';
import {VariableContext,LiteralContext,OptListContext,ParamContext,ParamListContext,ProgramContext, BlockContext,PipeActionsContext, SingleActionContext,
CommentContext, IfStatementContext, SwitchStatementContext, NamedFnContext, ActionContext, AnonFnContext, OptContext} from './grammar/RPScriptParser';

import {Translator} from '../core/translator';

export class RpsTranspileListener implements RPScriptListener {

  logger;

  deferred:Deferred<string>;

  translator:Translator;

  content:string;

  constructor(defer:Deferred<string>){
    this.deferred = defer;
    this.logger = Logger.getInstance();
  }

  public enterProgram(ctx: ProgramContext) : void{
    this.translator = new Translator();

    this.translator.content += this.translator.globalEventDeclare;

    this.translator.content += this.translator.mainSectionStart;
  }
  public exitProgram(ctx: ProgramContext) : void{
    this.translator.content += this.translator.mainSectionEnd;
    this.translator.content += "\n";
    this.translator.content += this.translator.fnSection;
    this.translator.content += "\n";
    this.translator.content += this.translator.runSect;

    //prepend
    this.translator.content = this.translator.importSection + this.translator.content;

    if(ctx.exception) this.deferred.reject(ctx.exception)
    else this.deferred.resolve(this.translator.content);
  }

  public enterBlock(ctx:BlockContext) : void {
    if(this.hasFnParent(ctx)) this.translator.fnSection += this.translator.startBlock;
    else this.translator.content += this.translator.startBlock;
  }
  public exitBlock(ctx:BlockContext) : void {
    if(this.hasFnParent(ctx)) this.translator.fnSection += this.translator.endBlock;
    else this.translator.content += this.translator.endBlock;
  }

  public enterPipeActions(ctx:PipeActionsContext) : void {
  }

  public enterComment(ctx:CommentContext) : void {
    this.translator.content += this.translator.genComment(ctx);
  }
  public enterIfStatement(ctx:IfStatementContext) : void {
    // this.logger.log('debug','enterIf : '+ctx.text);
    // this.translator.genIfStatement(ctx);
  }
  public enterSwitchStatement(ctx:SwitchStatementContext) : void {
    // this.logger.log('debug','enterSwitch : '+ctx.text);
    // this.translator.genSwitchStatement(ctx);
  }
  public enterNamedFn(ctx:NamedFnContext) : void {
    this.translator.fnSection += this.translator.genNamedFn(ctx);
  }

  public enterAction(ctx:ActionContext) : void {

    if(this.hasFnParent(ctx)) this.translator.fnSection += this.translator.startAction(ctx);
    else this.translator.content += this.translator.startAction(ctx);
  }
  public exitAction(ctx:ActionContext) : void {
    if(this.hasFnParent(ctx)) this.translator.fnSection += this.translator.closeAction(ctx);
    else this.translator.content += this.translator.closeAction(ctx);
  }

  private hasFnParent(ctx:any) : boolean{
    let ctxTemp:any = ctx;
    let isFnParent:boolean = false;
    while (ctxTemp){
      if('NamedFnContext' === ctxTemp.constructor.name){
        isFnParent = true;
        break;
      }
      ctxTemp = ctxTemp.parent;
    }
    return isFnParent;
  }

  public enterParamList(ctx:ParamListContext) : void {}
  public exitParamList(ctx:ParamListContext) : void {}
  public enterParam(ctx:ParamContext) : void {}
  public exitParam(ctx:ParamContext) : void {}
  public enterOptList(ctx:OptListContext) : void {}
  public exitOptList(ctx:OptListContext) : void {}
  public enterVariable(ctx:VariableContext) : void {}
  public enterLiteral(ctx:LiteralContext) : void {}

  public enterAnonFn(ctx:AnonFnContext) : void{
    // this.translator.genAnonFn(ctx);
  }
  public exitAnonFn(ctx:AnonFnContext) : void{
  }

}

export class RpsReplListener extends RpsTranspileListener {

  logger;

  deferred:Deferred<string>;

  translator:Translator;

  content:string;

  constructor(defer:Deferred<string>){
    super(defer);
  }

  public enterProgram(ctx: ProgramContext) : void{
    
    this.logger.log('debug','enterProgram : '+ctx.text);

    this.translator = new Translator();
    // this.translator.genBoilerHeader();

    this.logger.log('debug','gen : '+this.translator.content);
  }
  public exitProgram(ctx: ProgramContext) : void{
    this.logger.log('debug','exitProgram : '+ctx.text);
    this.logger.log('debug','gen : '+this.translator.content);

    // this.translator.content += "\n   module.exports = $CONTEXT";
    // this.translator.appendBottom();

    if(ctx.exception) this.deferred.reject(ctx.exception)
    else this.deferred.resolve(this.translator.content);
  }


}

export class ErrorCollectorListener implements ANTLRErrorListener<any> {

  syntaxError<T>(
    recognizer: Recognizer<T, any>, offendingSymbol: T, 
    line: number, charPositionInLine: number, 
    msg: string, e: RecognitionException): void {

      console.error("WEIRD STUFF");
  }

}