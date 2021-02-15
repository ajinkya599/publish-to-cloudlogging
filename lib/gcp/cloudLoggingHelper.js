"use strict";
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
exports.publishLogEvent = void 0;
const core = __importStar(require("@actions/core"));
const GCL = __importStar(require("@google-cloud/logging"));
const fs = __importStar(require("fs"));
function publishLogEvent(eventJson) {
    return __awaiter(this, void 0, void 0, function* () {
        const log = getLog();
        console.log(`Publishing the event to cloudlogging. Event message: ${JSON.stringify(eventJson)}`);
        const logEntry = log.entry(undefined, eventJson);
        yield log.write(logEntry);
        console.log('Published event to cloudlogging!');
    });
}
exports.publishLogEvent = publishLogEvent;
function getLog() {
    setupAuth();
    const projectId = core.getInput('project-id', { required: true });
    const logName = core.getInput('log-name', { required: true });
    console.log(`Project ID: ${projectId}`);
    console.log(`Log name: ${logName}`);
    let logging = new GCL.Logging({ projectId: projectId });
    const log = logging.log(logName);
    return log;
}
function setupAuth() {
    const serviceAccountCreds = core.getInput('creds', { required: true });
    const credsPath = `${process.env['RUNNER_TEMP']}/gcpcreds_${new Date().valueOf()}.json`;
    fs.writeFileSync(credsPath, serviceAccountCreds);
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = credsPath;
    console.log(`Set GOOGLE_APPLICATION_CREDENTIALS variable to ${process.env['GOOGLE_APPLICATION_CREDENTIALS']}`);
}
