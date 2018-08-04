
export class ErrorMessage {
    static handleKeywordMessage (exception:any) : void {
        let errorType = exception.constructor.name;
        if(errorType === 'InvalidKeywordException')
            this.handleInvalidKeywordException(exception);
        else if(errorType === 'TypeError')
            this.handleTypeError(exception);
        else if(errorType === 'InputMismatchException')
            this.handleInputMismatchException(exception);
        else if(errorType === 'ReferenceError'){
            this.handleReferenceError(exception);
        }

    }

    private static handleReferenceError(exception:any){
        console.error('*** handleReferenceError ***');
        console.error(exception);
    }

    private static handleInputMismatchException(exception:any){
        console.error('*** handleInputMismatchException ***');
        console.error(exception);
    }

    private static handleTypeError(exception:any){
        console.error('*** Type Error ***');
        console.error(exception);
    }

    private static handleInvalidKeywordException (exception:any) {
        let ctx = exception.actionContext;
        let offendingToken = ctx.WORD();
        let offendingWord = offendingToken.text;
        let line = offendingToken.payload._line;
        let recommended = exception.recommended;

        let input = ctx.start.inputStream.toString();
        let lines = input.split('\n');

        console.log('');
        console.log(`Oops... Don't recognize keyword ${offendingWord}. Do you mean ${recommended} ?`);
        console.log('');
        console.log(`line ${line}:`);
        console.log(lines[line-1]);

        // console.log('');
        // console.log(`Oops... Don't recognize keyword ${clc.red(offendingWord)}. Do you mean ${clc.blue('_')} ?`);
        // console.log('');
        // console.log(`line ${line} : `+clc.white.bgBlack(rawLine));
    }

    private static underlineError (lines, offendingWord,line, pos) {
        
        // let errorLine = lines[line-1];
  
        // let start = offendingToken.startIndex;
        // let stop = offendingToken.stopIndex;
  
        // console.log(errorLine);
        // for(var i=0;i<pos;i++)process.stdout.write(" ");
        // if(start>=0 && stop>=0) for(var i:number=start;i<stop+1;i++) process.stdout.write("^");
        // console.log('');
      }
}