export interface Service<T> {
    new (param: string): T;
  }
  
  export class ServiceFactory<T> {
  
    public createService(ctor: Service<T>, param: string) {
      return new ctor(param);
    }
  
  }