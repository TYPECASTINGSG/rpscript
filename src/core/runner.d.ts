import { RpsContext } from '../antlr/RpsSymTable';
export declare class Runner {
    config: any;
    constructor();
    compile(filepath: string): Promise<RpsContext>;
    private exec;
    execLine(line: any): Promise<any>;
    private parseTree;
}
