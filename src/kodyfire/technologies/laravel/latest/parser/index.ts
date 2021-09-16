import { extract } from "./extractor";
import { transform } from "./transformer";
import { load } from "./loader";
import { IParser } from "./parser";
export class Parser implements IParser {
reader() {
    throw new Error("Method not implemented.");
}
parser() {
    throw new Error("Method not implemented.");
}
    
validator = () => {
    return true;
}
extractor:any = () => {
    return extract();
}

transformer = () => {
    return transform();
}

loader = () => {
    return load();
}
}
