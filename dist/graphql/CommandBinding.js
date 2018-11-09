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
            describe: this.buildDescription(field),
            handler: function (args) {
                return _this.delegate(operation, fieldName, args);
            },
            builder: function (yargs) {
                return binding.buildCommandArguments(yargs, field.args);
            }
        };
    };
    CommandBinding.prototype.buildCommandString = function (fieldName, field) {
        var command = fieldName;
        var hasArgs = field.args.length > 0;
        if (!hasArgs) {
            return command;
        }
        command += this.buildCommandArgumentsString(field.args);
        return command;
    };
    CommandBinding.prototype.buildCommandArgumentsString = function (args) {
        var _this = this;
        var result = '';
        args.forEach(function (arg) {
            if (arg.type instanceof graphql_1.GraphQLObjectType) {
                var objectFields = arg.type.getFields();
                Object.entries(objectFields).forEach(function (_a) {
                    var objectFieldName = _a[0], objectField = _a[1];
                    result += _this.buildCommandArgumentsString(objectField.args);
                });
            }
            else {
                result += graphql_1.isNullableType(arg.type) || arg.defaultValue ? " [" + arg.name + "]" : " <" + arg.name + ">";
            }
        });
        return result;
    };
    CommandBinding.prototype.buildDescription = function (field) {
        if (field.isDeprecated === true) {
            return "[Deprecated] " + field.description;
        }
        return field.description ? field.description : false;
    };
    CommandBinding.prototype.buildCommandArguments = function (yargs, args) {
        var _this = this;
        args.forEach(function (arg) {
            var nullableType = graphql_1.getNullableType(arg.type);
            if (nullableType instanceof graphql_1.GraphQLObjectType) {
                var objectFields = nullableType.getFields();
                Object.entries(objectFields).forEach(function (_a) {
                    var objectFieldName = _a[0], objectField = _a[1];
                    _this.buildCommandArguments(yargs, objectField.args);
                });
            }
            else {
                var options = {
                    describe: arg.description != null ? arg.description : undefined,
                    type: _this.getArgumentType(nullableType),
                    default: arg.defaultValue
                };
                if (graphql_1.isEnumType(nullableType)) {
                    options.choices = _this.getArgumentChoices(nullableType);
                }
                yargs.positional(arg.name, options);
            }
        });
        return yargs;
    };
    CommandBinding.prototype.getArgumentType = function (type) {
        if (!graphql_1.isScalarType(type)) {
            return 'string';
        }
        var scalarType = type;
        if (scalarType.name === 'Boolean') {
            return 'boolean';
        }
        else if (scalarType.name === 'Int' || scalarType.name === 'Float') {
            return 'number';
        }
        return 'string';
    };
    CommandBinding.prototype.getArgumentChoices = function (type) {
        var enumValues = type.getValues();
        return enumValues.map(function (enumValue) {
            return enumValue.value;
        });
    };
    return CommandBinding;
}(graphql_binding_1.Delegate));
exports.default = CommandBinding;
//# sourceMappingURL=CommandBinding.js.map