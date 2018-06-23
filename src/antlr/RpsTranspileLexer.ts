import {RPScriptLexer} from './grammar/RPScriptLexer';
import {LexerNoViableAltException} from 'antlr4ts';


export class RpsTranspileLexer extends RPScriptLexer {

    public recover(re: LexerNoViableAltException): void{
        // console.error(re.inputStream);
        // console.log(re.recognizer);
        // _tokenStartCharIndex: 32,
        // _tokenStartLine: 5,
        // _tokenStartCharPositionInLine: 0,
   
    }
}

