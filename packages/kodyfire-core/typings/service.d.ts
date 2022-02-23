export interface Service<T> {
  new (param: string): T;
}
export declare class ServiceFactory<T> {
  createService(ctor: Service<T>, param: string): T;
}
//# sourceMappingURL=service.d.ts.map
