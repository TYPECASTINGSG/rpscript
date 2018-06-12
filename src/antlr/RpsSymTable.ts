//BaseScope , GlobalScope , LocalScope , Symbol , FunctionSymbol , VariableSymbol


export class RpsContext {

  globalScope: RpsScope ;
  currentScope: RpsScope;

  scopes: RpsScope[];

  outputContent:string;

  constructor(){
    this.scopes = [];
    this.globalScope = new RpsScope();
    this.currentScope = this.globalScope;

    this.scopes.push(this.globalScope);
    this.outputContent = "";
  }

  appendOutput(txt:string){
    this.outputContent += txt+'\n';
  }
  convertExpression (keyword:string, args:string[]){
    let expStr = '$RESULT = await c.'+keyword+'('+args.join(',')+');\n';
    this.outputContent += expStr;
  }

  getOutputStr() : string{
    return this.outputContent;
  }
}

export abstract class Symbol{}
export class FunctionSymbol extends Symbol{
  name:string;
  argument:string[];
  constructor(name,args){
    super();
    this.name = name;
    this.argument = args;
  }
}

export class KeywordSymbol extends Symbol{
  name:string;
  argument:string[];
  constructor(name,args){
    super();
    this.name = name;
    this.argument = args;
  }
}

export class RpsScope {
  input:any;
  output:any;
  var:{};
  expressions:FunctionSymbol[];
  keywords:KeywordSymbol[];

  constructor(){
    this.expressions = [];
    this.keywords = [];
  }

  addExpression(expr:FunctionSymbol){
    this.expressions.push(expr);
  }

  addKeyword(keyword:KeywordSymbol){
    this.keywords.push(keyword);
  }

}
