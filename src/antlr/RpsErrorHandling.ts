import {NoViableAltException,Parser,DefaultErrorStrategy,ANTLRErrorListener,Recognizer,RecognitionException, ParserRuleContext} from 'antlr4ts';
import { Override } from 'antlr4ts/Decorators';

export class RpsErrorStrategy extends DefaultErrorStrategy {

  //Not working
  @Override
  reportNoViableAlternative(recognizer: Parser, e: NoViableAltException): void {
    // throw new Error(e.message);
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

// line 1:0 mismatched input 'Echo' expecting {<EOF>, '@', COMMENT, WORD, NL}
// WEIRD STUFF
// line 3:5 token recognition error at: '"1111\n'
// ANTLRInputStream {
//   p: 30,
//   data: 'Echo "hello world"\n\necho "1111\n\n.echo "12121"\n\n\n',
//   n: 48 }
// RpsTranspileLexer {
//   _listeners: [ ConsoleErrorListener {} ],
//   _stateNumber: -1,
//   _factory: CommonTokenFactory { copyText: false },
//   _tokenStartCharIndex: 25,
//   _tokenStartLine: 3,
//   _tokenStartCharPositionInLine: 5,
//   _hitEOF: false,
//   _channel: 0,
//   _type: 0,
//   _modeStack: IntegerStack { _data: Int32Array [  ], _size: 0 },
//   _mode: 0,
//   _input: 
//    ANTLRInputStream {
//      p: 30,
//      data: 'Echo "hello world"\n\necho "1111\n\n.echo "12121"\n\n\n',
//      n: 48 },
//   _tokenFactorySourcePair: 
//    { source: [Circular],
//      stream: 
//       ANTLRInputStream {
//         p: 30,
//         data: 'Echo "hello world"\n\necho "1111\n\n.echo "12121"\n\n\n',
//         n: 48 } },
//   _interp: 
//    LexerATNSimulator {
//      atn: 
//       ATN {
//         states: [Array],
//         decisionToState: [Array],
//         modeNameToStartState: Map {},
//         modeToStartState: [Array],
//         contextCache: [Object],
//         decisionToDFA: [Array],
//         modeToDFA: [Array],
//         LL1Table: Map {},
//         grammarType: 0,
//         maxTokenType: 42,
//         ruleToTokenType: [Object],
//         ruleToStartState: [Array],
//         ruleToStopState: [Array],
//         lexerActions: [Array] },
//      optimize_tail_calls: true,
//      startIndex: 25,
//      _line: 3,
//      _charPositionInLine: 10,
//      mode: 0,
//      prevAccept: SimState { index: -1, line: 0, charPos: -1, dfaState: undefined },
//      recog: [Circular] },
//   _token: undefined,
//   _text: undefined }

// line 5:0 token recognition error at: '.e'
// ANTLRInputStream {
//   p: 33,
//   data: 'Echo "hello world"\n\necho "1111\n\n.echo "12121"\n\n\n',
//   n: 48 }
// RpsTranspileLexer {
//   _listeners: [ ConsoleErrorListener {} ],
//   _stateNumber: -1,
//   _factory: CommonTokenFactory { copyText: false },
//   _tokenStartCharIndex: 32,
//   _tokenStartLine: 5,
//   _tokenStartCharPositionInLine: 0,
//   _hitEOF: false,
//   _channel: 0,
//   _type: 0,
//   _modeStack: IntegerStack { _data: Int32Array [  ], _size: 0 },
//   _mode: 0,
//   _input: 
//    ANTLRInputStream {
//      p: 33,
//      data: 'Echo "hello world"\n\necho "1111\n\n.echo "12121"\n\n\n',
//      n: 48 },
//   _tokenFactorySourcePair: 
//    { source: [Circular],
//      stream: 
//       ANTLRInputStream {
//         p: 33,
//         data: 'Echo "hello world"\n\necho "1111\n\n.echo "12121"\n\n\n',
//         n: 48 } },
//   _interp: 
//    LexerATNSimulator {
//      atn: 
//       ATN {
//         states: [Array],
//         decisionToState: [Array],
//         modeNameToStartState: Map {},
//         modeToStartState: [Array],
//         contextCache: [Object],
//         decisionToDFA: [Array],
//         modeToDFA: [Array],
//         LL1Table: Map {},
//         grammarType: 0,
//         maxTokenType: 42,
//         ruleToTokenType: [Object],
//         ruleToStartState: [Array],
//         ruleToStopState: [Array],
//         lexerActions: [Array] },
//      optimize_tail_calls: true,
//      startIndex: 32,
//      _line: 5,
//      _charPositionInLine: 1,
//      mode: 0,
//      prevAccept: SimState { index: -1, line: 0, charPos: -1, dfaState: undefined },
//      recog: [Circular] },
//   _token: undefined,
//   _text: undefined }
