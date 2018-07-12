import clc from 'cli-color';

export class ErrorMessage {
    static handleKeywordMessage (exception:any) : void {
        let errorType = exception.constructor.name;
        if(errorType === 'InvalidKeywordException')
            this.handleInvalidKeywordException(exception);
        else if(errorType === 'TypeError')
            this.handleTypeError(exception);
        else if(errorType === 'InputMismatchException')
            this.handleInputMismatchException(exception)
        else
            console.error('TODO FOR : '+errorType);

    }

    private static handleInputMismatchException(exception:any){
        console.error('*** handleInputMismatchException ***');
        console.error(exception);
    }

    private static handleTypeError(exception:any){
        console.error('*** Type Error ***');
        // console.error(exception);
    }

    private static handleInvalidKeywordException (exception:any) {
        let ctx = exception.actionContext;
        let offendingToken = ctx.WORD();
        let offendingWord = offendingToken.text;
        let line = offendingToken.payload._line;
        let rawLine = ctx.start.inputStream.data;

        console.log('');
        console.log(`Oops... Don't recognize keyword ${clc.red(offendingWord)}. Do you mean ${clc.blue('_')} ?`);
        console.log('');
        console.log(`line ${line} : `+clc.white.bgBlack(rawLine));
    }
}