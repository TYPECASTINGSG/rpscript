export declare class Runner {
    config: any;
    constructor();
    compile(filepath: string): Promise<any>;
    run(filepath: string): Promise<any>;
    tsc(filepath: string): any;
    private exec;
    private parseTree;
}
