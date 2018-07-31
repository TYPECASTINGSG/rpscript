var pJson = require('../../package.json');

export class VersionCommand {

  constructor() {}

  getVersions() : string {
    return pJson.version;
  }
}
