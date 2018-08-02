import {ModuleMgr} from 'rpscript-parser';
import Table from 'cli-table';
import * as R from '../../lib/ramda.min';
import {EventEmitter} from 'events';
import {Logger} from '../core/logger';

var pjson = require('../../package.json');

export class ModuleCommand {

  modMgr:ModuleMgr;
  logger:any;

  constructor() {
      this.modMgr = new ModuleMgr;
      this.logger = Logger.createModuleLogger();
      this.registerDefaultEvents(this.modMgr.event);
  }

  async install(allowExternalModule:boolean,modName:string[]) :Promise<void>{
    
    for(var i=0;i<modName.length;i++){
      if(!allowExternalModule && !R.contains(modName[i],pjson.officialModules))
        this.logger.error(modName[i]+' is not part of the official package. Fail to install.');  
      else {
        this.logger.info('installing module '+modName[i]+'...');
        await this.modMgr.installModule(modName[i],allowExternalModule);
      }
      
    }
  }
  async remove(modName:string[]) :Promise<any>{
    for(var i=0;i<modName.length;i++){
      this.logger.info('removing module '+modName[i]+'...');
      this.modMgr.removeModule(modName[i]);  
    }
  }

  listInstalledModulesArr() : string[] {
    let installedModules = R.keys( R.omit(['$DEFAULT'], this.modMgr.listInstalledModules()) );
    return installedModules;
  }

  listInstalledModules() : string{
    let installedModules = R.values( R.omit(['$DEFAULT'], this.modMgr.listInstalledModules()) );
    
    let table = new Table({head: ['name', 'version']});
    // let table = new Table({head: ['name', 'version','enable','description']});

    installedModules.forEach(mod => table.push([mod.name, mod.npmVersion] ));
    // installedModules.forEach(mod => table.push([
    //   mod.name, mod.npmVersion, mod.enabled, !mod.description ? '' : mod.description] ));

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
    if(!module)
      return 'module '+mod+' is not installed';
    else {
      // let table = new Table({head:['action','params']});
      // let actions = module.actions;
      // let paramsStr = (paramsArr) => R.pluck( 'name', R.values(paramsArr) ).join(',');

      // var eachAction = (value, key) => {
      //   table.push([value.verbName, paramsStr(value.params)]);
      // };
      // R.forEachObjIndexed(eachAction, actions);
      // let actionsTbl = table.toString();

      let v = R.pluck('verbName', R.values( R.prop('actions')(module)) );

      let modName = 'name : '+module.name;
      let modVersion = 'version : '+module.npmVersion;
      let allActions = 'actions : '+v.join(', ');

      return modName + '\n' + modVersion + '\n' + allActions;
    }


  }
  listDefaultKeywords() : string {
    let defaultMod = this.modMgr.listInstalledModules()['$DEFAULT'];
    let defKeywords = R.keys(defaultMod);

    let table = new Table({head:['keyword','modules']});

    let modList = (modActionList) => {
      return R.pluck('moduleName',modActionList).join(',');
    }

    R.forEachObjIndexed((val,key)=>{
      table.push([key,modList(val)]);
    }, defaultMod);

    return table.toString();
  }


  registerDefaultEvents(evtEmt:EventEmitter) : void{
    
    evtEmt.on(ModuleMgr.MOD_INSTALLED_NPM_EVT, params => {
      this.logger.info('module '+params.name+' installed');
      this.logger.info(params.npm.text);
    });

    evtEmt.on(ModuleMgr.MOD_INSTALLED_CONFIG_EVT, params => {
      this.logger.info('module '+params.name+' configured ');
    });

    evtEmt.on(ModuleMgr.MOD_INSTALLED_ERROR_EVT, params => {
      this.logger.error(params);
    });


    evtEmt.on(ModuleMgr.MOD_REMOVED_NPM_EVT, params => {
      this.logger.info('module removed : '+params+'');
    });

    evtEmt.on(ModuleMgr.MOD_REMOVED_CONFIG_EVT, params => {
      this.logger.info('module '+params.name+' removed configuration');
    });

    evtEmt.on(ModuleMgr.MOD_REMOVED_ERROR_EVT, params => {
      this.logger.error(params);
    });



  }
}
