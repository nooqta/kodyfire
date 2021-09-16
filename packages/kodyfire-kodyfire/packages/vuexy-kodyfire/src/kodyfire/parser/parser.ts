export interface IParser {
    reader(): any;
    validator(): boolean;
    parser(): any;
    extractor(): any;
    loader(): any;
}