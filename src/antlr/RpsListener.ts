import fs from 'fs';
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import {Deferred} from "ts-deferred";
import {Logger} from '../core/logger';

import {RPScriptListener} from './grammar/RPScriptListener';
import {VariableContext,LiteralContext,OptListContext,ParamContext,ParamListContext,ProgramContext, BlockContext,PipeActionsContext, SingleActionContext,
CommentContext, IfStatementContext, SwitchStatementContext, NamedFnContext, ActionContext, AnonFnContext, OptContext} from './grammar/RPScriptParser';

import {Translator} from '../core/translator';
// import {RpsContext, FunctionSymbol, KeywordSymbol} from './RpsSymTable';

export class RpsMainListener implements RPScriptListener {

  logger;

  deferred:Deferred<any>;

  // symTable:RpsContext;
  translator:Translator;

  content:string;

  constructor(defer:Deferred<any>){
    this.deferred = defer;
    this.logger = Logger.getInstance();
  }

  public enterProgram(ctx: ProgramContext) : void{
    
    this.logger.log('debug','enterProgram : '+ctx.text);

    this.translator = new Translator();
    this.translator.genBoilerHeader();

    this.logger.log('debug','gen : '+this.translator.content);
  }
  public exitProgram(ctx: ProgramContext) : void{
    this.logger.log('debug','exitProgram : '+ctx.text);
    this.logger.log('debug','gen : '+this.translator.content);

    this.translator.appendBottom();

    this.deferred.resolve(this.translator.content);
  }

  public enterBlock(ctx:BlockContext) : void {
    this.logger.log('debug','enterBlock : '+ctx.text);
    this.translator.genBlock(ctx);
    this.logger.log('debug','gen : '+this.translator.content);
  }
  public exitBlock(ctx:BlockContext) : void {
    this.logger.log('debug','exitBlock : '+ctx.text);
    this.translator.closeBlock(ctx);
    this.logger.log('debug','gen : '+this.translator.content);
  }

  public enterPipeActions(ctx:PipeActionsContext) : void {
    // this.logger.log('debug','enterPipeline : '+ctx.text);
  }

  public enterSingleAction(ctx:SingleActionContext) : void {
    // this.logger.log('debug','enterSingleAction : '+ctx.text);
  }

  public enterComment(ctx:CommentContext) : void {
    // this.logger.log('debug','enterComment : '+ctx.text);
    // this.translator.genComment(ctx);
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
    this.logger.log('debug','enterNamedFn : '+ctx.text);
    this.translator.genNamedFn(ctx);
    this.logger.log('debug','gen : '+this.translator.content);
  }

  public enterAction(ctx:ActionContext) : void {
    this.logger.log('debug','enterAction : '+ctx.text);
    this.translator.genAction(ctx);
    this.logger.log('debug','gen : '+this.translator.content);
  }
  public exitAction(ctx:ActionContext) : void {
    this.logger.log('debug','exitAction : '+ctx.text);
    this.translator.closeAction(ctx);
    this.logger.log('debug','gen : '+this.translator.content);
  }
  public enterParamList(ctx:ParamListContext) : void {
    // this.logger.log('debug','enterParamList : '+ctx.text);
    // this.translator.genParamList(ctx);
    // this.logger.log('debug','gen : '+this.translator.content);
  }
  public exitParamList(ctx:ParamListContext) : void {
    // this.logger.log('debug','exitParamList : '+ctx.text);
  }

  public enterParam(ctx:ParamContext) : void {
    // this.logger.log('debug','enterParam : '+ctx.text);
  }
  public exitParam(ctx:ParamContext) : void {
    // this.logger.log('debug','exitParam : '+ctx.text);
    // this.translator.appendComma();
    // this.logger.log('debug','gen : '+this.translator.content);
  }

  public enterOptList(ctx:OptListContext) : void {
    // this.logger.log('debug','enterOptList : '+ctx.text);
    // this.translator.genOptList(ctx);
    // this.logger.log('debug','gen : '+this.translator.content);
  }
  public exitOptList(ctx:OptListContext) : void {
    // this.logger.log('debug','exitOptList : '+ctx.text);
  }

  public enterVariable(ctx:VariableContext) : void {
    // this.logger.log('debug','enterVariable : '+ctx.text);
    // this.translator.genVariable(ctx);
    // this.logger.log('debug','gen : '+this.translator.content);
  }

  public enterLiteral(ctx:LiteralContext) : void {
    // this.logger.log('debug','enterLiteral : '+ctx.text);
    // this.translator.genLiteral(ctx);
    // this.logger.log('debug','gen : '+this.translator.content);
  }

  public enterAnonFn(ctx:AnonFnContext) : void{
    this.logger.log('debug','enterAnonFn : '+ctx.text);
    this.translator.genAnonFn(ctx);
    this.logger.log('debug','gen : '+this.translator.content);
  }
  public exitAnonFn(ctx:AnonFnContext) : void{
    this.logger.log('debug','exitAnonFn : '+ctx.text);
  }


}
