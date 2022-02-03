
import { IValidator } from "kodyfire-core";
import { IParser } from "kodyfire-core";

export class Parser implements IParser {
validator: IValidator;
data: any
requiresExtract = false;
requiresTansform = false;
requiresLoad = false;
constructor(validator: IValidator) {
    this.validator = validator
}
reader() {
    // read what
}
parse(data: any) {
    if(!this.validate(data)) {
        throw new Error("Source schema is invalid");  
    }
    
}
    
validate = (data: any) => {
    return this.validator.validate(data);
}
}
