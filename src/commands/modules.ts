import {ModuleMgr,KeywordsMgr} from 'rpscript-parser';

export class ModuleCommand {

  modMgr:ModuleMgr;

  constructor() {
      this.modMgr = new ModuleMgr;
  }

  async install(modName:string) :Promise<any>{
      this.modMgr.installModule(modName);
  }
  async remove(modName:string) :Promise<any>{
    this.modMgr.removeModule(modName);  
  }
}
