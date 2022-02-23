export declare interface IKody {
  parser: IParser;
}

/**
 * The IParser interface
 * @alpha
 */
export declare interface IParser {
  data: any;
  requiresExtract: boolean;
  requiresTansform: boolean;
  requiresLoad: boolean;
  validator: IValidator;
  reader(filename: string): any;
  parse(data: any): any;
}

export declare interface IValidator {
  rules: any;
  errors: any;
  validate(data: any): boolean;
}

export {};
