import clc from 'cli-color';

export class ErrorMessage {
    static handleKeywordMessage (exception:any) : void {
        let errorType = exception.constructor.name;
        if(errorType === 'InvalidKeywordException')
            this.handleInvalidKeywordException(exception);
        else
            console.error('TODO FOR : '+errorType);

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