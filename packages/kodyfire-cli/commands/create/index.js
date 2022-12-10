'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("./kody/src");
const input = __importStar(require("./data.json"));
const { Command } = require('commander');
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const kody = new src_1.Kody(args);
        // parse source
        let data = kody.parse(input);
        data = Object.assign(Object.assign({}, data), args);
        data.outputDir = `${data.name}-kodyfire`;
        const output = yield kody.generate(data);
        return output;
    });
}
module.exports = (program) => {
    program
        .command('create')
        .description('Generate a new blank kody project')
        .argument('<name>', 'Project name')
        .argument('<technology>', 'Project technology')
        .option('-tpl, --templateFolder <templateFolder>', 'Template folder to use. Available templates: simple, basic. Default: simple', 'simple')
        .action((name, technology, _opt) => __awaiter(void 0, void 0, void 0, function* () {
        // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
        try {
            action(Object.assign({ name, technology }, _opt));
        }
        catch (error) {
            console.log(error);
        }
    }));
};
//# sourceMappingURL=index.js.map