import * as api from 'rpscript-api';

let common = api.common;
let test = api.test;
let chrome = api.chrome;
let functional = api.functional;
let file = api.file;
let desktop = api.desktop;
let RpsContext = api.RpsContext;

export {common, test, chrome, functional, file, desktop, RpsContext }

let Echo = common.Echo, Open = common.Open, Wait = common.Wait,
    Notify = common.Notify, As = common.As, Once = common.Once;

let TestSuite = test.TestSuite, TestCase = test.TestCase, Expect = test.Expect, TestReport = test.TestReport;

let Map = functional.Map, Filter = functional.Filter, ForEach = functional.ForEach;

let Read = file.Read, Append = file.Append, Write = file.Write, Delete = file.Delete, Exists = file.Exists,
    Rename = file.Rename, Stat = file.Stat;

let Keyboard = desktop.Keyboard, Mouse = desktop.Mouse, Info = desktop.Info;

let Browser = chrome.Open, Close = chrome.Close, Goto = chrome.Goto, Click = chrome.Click,
Type = chrome.Type, Eval = chrome.Eval, Pdf = chrome.Pdf, Screenshot = chrome.Screenshot,
$ = chrome.$, $$ = chrome.$$, Emulate = chrome.Emulate;

export {
    Echo,Open,Wait,Notify,As,Once,
    TestSuite,TestReport,TestCase,Expect,
    Map,Filter,ForEach,
    Read,Append,Write,Delete,Exists,Rename,Stat,
    Keyboard,Mouse,Info, 
    Browser,Close,Goto,Click,Type,Eval,Pdf,Screenshot,$,$$,Emulate};
