import { Package } from '..';

export interface IKodyWorkflow {
  input: any;
  getKody(name: string): any;
  handleKodyNotFound(name: string): any;
  handleSourceNotValid(name: string): any;
  handleKodySuccess(name: string): any;
  handleKodyError(name: string): any;
}

export class KodyWorkflow implements IKodyWorkflow {
  handleKodyError(message: string) {
    console.log(`${message}`);
  }
  input: any;
  public getKody = async (_name: string): Promise<any> => {
    const packages = await Package.getInstalledKodies();
    return packages.find((kody: any) => kody.id === _name);
  };
  public handleKodyNotFound = (name: string): any => {
    console.log(`Kody ${name} not found.`);
  };

  public handleSourceNotValid = (errors: any): any => {
    console.log(`Kody source not valid.`);
    console.log(errors);
  };

  public handleKodySuccess = (name: string): any => {
    console.log(`Kody ${name} success.`);
  };
}
