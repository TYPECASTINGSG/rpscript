import {ModuleMgr} from 'rpscript-parser';
import Table from 'cli-table';
import R from 'ramda';

export class ModuleCommand {

  modMgr:ModuleMgr;

  constructor() {
      this.modMgr = new ModuleMgr;
  }

  async install(modName:string[]) :Promise<any>{
      this.modMgr.installModule(modName[0]);
  }
  async remove(modName:string[]) :Promise<any>{
    this.modMgr.removeModule(modName[0]);  
  }
  listInstalledModules() : string{
    let installedModules = this.modMgr.listInstalledModules();
    let modNames = R.filter( k => k!=='$DEFAULT', R.keys(installedModules));
    
    let table = new Table({head: ['name', 'version','enabled']});

    modNames.forEach(mod => table.push([mod,'-','Yes'] ));

    return table.toString();
  }
  listInstallModulesJson() : string {
    let installedModules = this.modMgr.listInstalledModules();

    return JSON.stringify(installedModules,null,2);
  }
  listAvailableModules() : string{
    return JSON.stringify(this.modMgr.listAvailableModules());
  }
  listModuleInfo(mod) : string {
    let iModules = this.modMgr.listInstalledModules();
    let module = iModules[mod];
    let output = 'module '+mod+' is not installed';

    let table = new Table({head:['action','default name','default pattern']});

    if(module) {
      let actions = R.keys(module.actions);

      actions.forEach(a => {
        let v = module.actions[a];
        table.push([a,v.defaultName, v.defaultParamPatterns ]);
      });
    }

    return table.toString();
  }
  listDefaultKeywords() : string {
    let defaultMod = this.modMgr.listInstalledModules()['$DEFAULT'];
    let defKeywords = R.keys(defaultMod);

    let table = new Table({head:['keyword','detail']});

    defKeywords.forEach(k => {
      table.push([ k,defaultMod[k] ]);
    });

    return table.toString();
  }
}
