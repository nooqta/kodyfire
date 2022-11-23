"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
// Database access layer
class Database {
    constructor(params) {
        this.user = params.env.DB_USERNAME;
        this.password = params.env.DB_PASSWORD;
        this.host = params.env.DB_HOST;
        this.port = params.env.DB_PORT;
        this.database = params.env.DB_DATABASE;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield promise_1.default.createConnection({
                host: this.host,
                user: this.user,
                password: this.password,
                port: this.port,
                database: this.database,
            });
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map