import { IValidator } from './validator';
/**
 * The IParser interface
 * @alpha
 */
export interface IParser {
  data: any;
  requiresExtract: boolean;
  requiresTansform: boolean;
  requiresLoad: boolean;
  validator: IValidator;
  reader(filename: string): any;
  write(filename: string, data: any): any;
  parse(data: any): any;
}
//# sourceMappingURL=parser.d.ts.map
