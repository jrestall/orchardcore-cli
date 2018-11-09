"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var graphql_binding_1 = require("graphql-binding");
var CommandBinding = /** @class */ (function (_super) {
    __extends(CommandBinding, _super);
    function CommandBinding(_a) {
        var schema = _a.schema, fragmentReplacements = _a.fragmentReplacements, before = _a.before;
        var _this = _super.call(this, { schema: schema, fragmentReplacements: fragmentReplacements, before: before }) || this;
        _this.commands = _this.mapMutations();
        return _this;
    }
    CommandBinding.prototype.mapMutations = function () {
        var mutationType = this.schema.getMutationType();
        if (!mutationType) {
            return [];
        }
        return this.buildCommands('mutation', mutationType.getFields());
    };
    CommandBinding.prototype.buildCommands = function (operation, fields) {
        var _this = this;
        return Object.entries(fields)
            .map(function (_a) {
            var fieldName = _a[0], field = _a[1];
            return _this.buildCommand(operation, fieldName, field);
        });
    };
    CommandBinding.prototype.buildCommand = function (operation, fieldName, field) {
        var _this = this;
        var binding = this;
        return {
            command: this.buildCommandString(fieldName, field),
            describe: field.description != null ? field.description : false,
            handler: function (args) {
                return _this.delegate(operation, fieldName, args);
            },
            builder: function (yargs) {
                return binding.buildCommandArguments(yargs, field);
            }
        };
    };
    CommandBinding.prototype.buildCommandString = function (fieldName, field) {
        var command = fieldName;
        var hasArgs = field.args.length > 0;
        if (!hasArgs) {
            return command;
        }
        field.args.forEach(function (arg) {
            if (graphql_1.isNullableType(arg.type)) {
                command += " [" + arg.name + "]";
            }
            else {
                command += " <" + arg.name + ">";
            }
        });
        return command;
    };
    CommandBinding.prototype.buildCommandArguments = function (yargs, field) {
        var _this = this;
        var hasArgs = field.args.length > 0;
        if (!hasArgs) {
            return yargs;
        }
        field.args.forEach(function (arg) {
            yargs.positional(arg.name, {
                describe: arg.description != null ? arg.description : undefined,
                type: _this.GetArgumentType(arg.type),
                default: arg.defaultValue
            });
        });
        return yargs;
    };
    CommandBinding.prototype.GetArgumentType = function (type) {
        if (graphql_1.isScalarType(type)) {
            return 'string';
        }
        return 'string';
    };
    return CommandBinding;
}(graphql_binding_1.Delegate));
exports.default = CommandBinding;
//# sourceMappingURL=CommandBinding.js.map