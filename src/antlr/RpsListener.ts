import _ from 'lodash';
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import {Deferred} from "ts-deferred";

import {RpsListener} from './grammar/RpsListener';
import { StatementContext, FileContext, UnknownContext, ExpressionContext } from './grammar/RpsParser';

import {RpsContext, FunctionSymbol, KeywordSymbol} from './RpsSymTable';

export class RpsMainListener implements RpsListener {

  deferred:Deferred<any>;

  symTable:RpsContext;

  content:string;

  constructor(defer:Deferred<any>){
    this.deferred = defer;
  }

  public enterFile(ctx: FileContext) : void{
    this.symTable = new RpsContext();
    this.content = "";
  }
  public exitFile(ctx: FileContext) : void{
    this.deferred.resolve(this.symTable);
  }

  public enterExpression(ctx:ExpressionContext) : void{

    this.symTable.convertExpression(
      ctx.CAP_STRING().text, _.map(ctx.argument(), (arg)=>arg.text) );
  }
  public enterUnknown(ctx: UnknownContext) : void{
    console.log('unknown : ');console.log(ctx.text);
    this.symTable.appendOutput(ctx.text);
  }

  public enterStatement(ctx: StatementContext) : void{
    // let exprs = ctx.expression()[0];
    // exprs ? console.log(exprs.text) : '';
    // console.log('*******************');
    // let unknown = ctx.unknown();
    // if(unknown) console.log(unknown.text);

    // console.log(ctx.unknown().text);
    // exprs.forEach( (expr) => {
    //   let fnName = expr.function().text;
    //   this.symTable.currentScope.addExpression(
    //     new FunctionSymbol(fnName, _.map(expr.argument(), (arg)=>arg.text ) ) );
    // }
    // );

    // let controls = ctx.control();
    // let exprs = ctx.expression();
    //
    // exprs.forEach( (expr) => {
    //   let fnName = expr.function().text;
    //   this.symTable.currentScope.addExpression(
    //     new FunctionSymbol(fnName, _.map(expr.argument(), (arg)=>arg.text ) ) );
    // }
    // );
    //
    // controls.forEach( (control) =>{
    //     let kwName = control.KEYWORD().text;
    //     this.symTable.currentScope.addKeyword(
    //       new KeywordSymbol(kwName,_.map(control.argument(), (arg)=>arg.text ) ) );
    //   }
    // );

  }
  public exitStatement(ctx: StatementContext) : void{
  }

  public enterEveryRule(ctx: ParserRuleContext): void {
  }
}
