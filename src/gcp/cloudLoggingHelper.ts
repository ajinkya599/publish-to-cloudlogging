import * as core from '@actions/core';
import * as GCL from '@google-cloud/logging';
import * as fs from 'fs';

export async function publishLogEvent(eventJson: any) {
  const log = getLog();
  console.log(`Publishing the event to cloudlogging. Event message: ${JSON.stringify(eventJson)}`);
  const logEntry = log.entry(undefined, eventJson);
  await log.write(logEntry);
  console.log('Published event to cloudlogging!');
}

function getLog(): GCL.Log {
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