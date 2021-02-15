import * as core from '@actions/core';
import * as fs from 'fs';
import * as CloudLoggingHelper from './gcp/cloudLoggingHelper';

async function run() {
  try {
    console.log('Publishing traceability...');
    await publishTraceability();
    console.log('Done!');
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function publishTraceability() {
  const logsPath = core.getInput('logs-path', { required: true });
  await CloudLoggingHelper.publishLogEvent(readJsonFromFile(logsPath));
}

function readJsonFromFile(path: string): any {
  try {
    const rawContent = fs.readFileSync(path, 'utf-8');
    return JSON.parse(rawContent);
  } catch(error) {
    throw new Error(`An error occured while reading/parsing the file: ${path}`);
  }    
}

run();