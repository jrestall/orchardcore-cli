"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
var apollo_link_http_1 = require("apollo-link-http");
var apollo_link_context_1 = require("apollo-link-context");
var graphql_tools_1 = require("graphql-tools");
var CommandBinding_1 = __importDefault(require("./CommandBinding"));
function getLink(uri) {
    var http = new apollo_link_http_1.HttpLink({ uri: uri, fetch: node_fetch_1.default });
    var link = apollo_link_context_1.setContext(function (request, previousContext) { return ({
        headers: {
            'Authorization': "Bearer 12345"
        }
    }); }).concat(http);
    return link;
}
function getExecutableSchema(link) {
    return __awaiter(this, void 0, void 0, function () {
        var schema, executableSchema;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, graphql_tools_1.introspectSchema(link)];
                case 1:
                    schema = _a.sent();
                    executableSchema = graphql_tools_1.makeRemoteExecutableSchema({
                        schema: schema,
                        link: link,
                    });
                    return [2 /*return*/, executableSchema];
            }
        });
    });
}
function getCommandBinding(uri) {
    return __awaiter(this, void 0, void 0, function () {
        var link, schema, before, binding;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    link = getLink(uri);
                    return [4 /*yield*/, getExecutableSchema(link)];
                case 1:
                    schema = _a.sent();
                    before = function () { return console.log("Sending a request to Orchard Core ..."); };
                    binding = new CommandBinding_1.default({ schema: schema, before: before });
                    return [2 /*return*/, binding];
            }
        });
    });
}
exports.getCommandBinding = getCommandBinding;
//# sourceMappingURL=index.js.map