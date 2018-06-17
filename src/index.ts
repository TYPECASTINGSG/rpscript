import {Runner} from './core/runner';
import {RpsContext} from './antlr/RpsSymTable';

function valid () {
}

function exec () {

}

let parse = function (filePath:string) : Promise<RpsContext> {
    let runner = new Runner();
    return runner.convertToTS(filePath);
}

module.exports = {
    run:exec,
    parser:parse,
    validate:valid
};