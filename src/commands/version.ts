// import * as shell from 'shelljs';
import * as fs from 'fs';
import {Readable} from 'stream';

// import { ProjectUtil } from '../utils/projects';
// import { ProjectConfig } from '../models/ProjectConfig';

export class VersionCommand {
  TAGUI_VERSION:string = "0.1.0";

  constructor() {
  }

  getVersions() : string {
    return '\n___________________________________'+'\n\n'+
    'tagui cli : '+this.TAGUI_VERSION+'\n' +
    'tagui     : '+this.getTagUiVersion()+'\n' +
    'node      : '+this.getNodeVersion() +
    'npm       : '+this.getNpmVersion() +'\n'+
    '___________________________________'+'\n';
  }

  getNodeVersion () :string | Readable{
    return "TODO Node Version";
    // return shell.exec('node --version',{silent:true}).stdout;
  }
  getNpmVersion () :string | Readable{
    return "TODO Npm Version";
    // return shell.exec('npm --version',{silent:true}).stdout;
  }

  getTagUiVersion() : string {
    let version = "To be Removed";

    // if(fs.existsSync('tagui-config.json')){
      // let config = ProjectConfig.parse( fs.readFileSync('tagui-config.json', 'utf8') );
      // version = config.version;
    // }

    return version;
  }
}
