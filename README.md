# RPSCRIPT <img src="https://s3.amazonaws.com/sample.rpscript.com/images/cheerful_robot50.png" width="30px"> <img src="https://s3.amazonaws.com/sample.rpscript.com/images/cheerful_robot50.png" width="30px"> <img src="https://s3.amazonaws.com/sample.rpscript.com/images/cheerful_robot50.png" width="30px">

[![npm version](https://badge.fury.io/js/rpscript.svg)](https://badge.fury.io/js/rpscript)

<img style="float: right;" src="https://s3.amazonaws.com/sample.rpscript.com/images/cool_robot100.png">
A simple scripting language to automate the boring stuff.

RPScript provides a framework that simplifies automation. The syntax is designed to be intuitive and straightforward,  allowing you to write scripts without the need for in-depth programming knowledge.

In short, it allows you to replace this:
```
var R = require('ramda');

console.log( R.repeat("Hello world",3) );
```

with this:
```
log repeat "Hello world" 3
```

This:
```
var download = require('download');
var csvParse = require('csv-parse/lib/sync');
var AdmZip = require('adm-zip');
var R = require('ramda');
var fs = require('fs');

download('https://data.gov.sg/dataset/dba9594b-fb5c-41c5-bb7c-92860ee31aeb/download', '.').then(() => {
    var zip = new AdmZip("./download.zip");
    
    zip.extractAllTo("./temp/");

    var content = fs.readFileSync('temp/data-gov-sg-dataset-listing.csv');
    
    var orgs = csvParse(content , {columns:true});

    var orgList = R.uniq(R.pluck('organisation',orgs));

    console.log(orgList); //print out the list of organisations
});

```
with this:
```
download "." "https://data.gov.sg/dataset/dba9594b-fb5c-41c5-bb7c-92860ee31aeb/download"

extract "download.zip" "./temp/"

csv-to-data --columns=true read-file "temp/data-gov-sg-dataset-listing.csv" | as "dataset"

log uniq pluck 'organisation' $dataset
```



## Installation <img src="https://s3.amazonaws.com/sample.rpscript.com/images/smart_robot50.png" width="18px">

Prerequisite: NodeJS

```
npm i -g rpscript
```
This will install a global command line in your machine.

Module installation.
```
rps install basic
```

Create a file "helloworld.rps" and add this line:
```
log repeat "hello world " 3
```

## Getting Started <img src="https://s3.amazonaws.com/sample.rpscript.com/images/handy_robot50.png" width="25px">

Getting started guide is available at [Getting Started](http://docs.rpscript.com/tutorial-gettingstarted.html).

## Usage <img src="https://s3.amazonaws.com/sample.rpscript.com/images/handy_robot50.png" width="25px">

Usage guide is available at [Usage](http://docs.rpscript.com/tutorial-usage.html)


## Modules <img src="https://s3.amazonaws.com/sample.rpscript.com/images/bossy_robot50.png" width="18px">

Name | Status | Description | Doc
--- | --- | --- | ---
[Basic](https://github.com/TYPECASTINGSG/rpscript-api-basic) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-basic.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-basic) | Basic operation and data manipulation. | [Here](http://docs.rpscript.com/Basic.html)
[Beeper](https://github.com/TYPECASTINGSG/rpscript-api-beeper) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-beeper.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-beeper) | Make terminal beeps. | [Here](http://docs.rpscript.com/Beeper.html)
[CSV](https://github.com/TYPECASTINGSG/rpscript-api-csv) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-csv.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-csv) | CSV utility. | [Here](http://docs.rpscript.com/CSV.html)
[Date](https://github.com/TYPECASTINGSG/rpscript-api-date) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-date.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-date) | Date utility. | [Here](http://docs.rpscript.com/Date.html)
[Downloading](https://github.com/TYPECASTINGSG/rpscript-api-download) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-downloading.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-downloading) | File Download. | [Here](http://docs.rpscript.com/Download.html)
[Figlet](https://github.com/TYPECASTINGSG/rpscript-api-figlet) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-figlet.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-figlet) | Ascii Art. | [Here](http://docs.rpscript.com/Figlet.html)
[File](https://github.com/TYPECASTINGSG/rpscript-api-file) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-file.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-file) | File system. | [Here](http://docs.rpscript.com/File.html)
[Hogan](https://github.com/TYPECASTINGSG/rpscript-api-hogan) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-hogan.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-hogan) | Moustache Templating. | [Here](http://docs.rpscript.com/Hogan.html)
[Notifier](https://github.com/TYPECASTINGSG/rpscript-api-notifier) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-notifier.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-notifier) | Desktop Notification. | [Here](http://docs.rpscript.com/Notifier.html)
[Open](https://github.com/TYPECASTINGSG/rpscript-api-open) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-open.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-open) | Open a file or url in the user's preferred application. | [Here](http://docs.rpscript.com/Open.html)
[Zip](https://github.com/TYPECASTINGSG/rpscript-api-adm-zip) | [![npm version](https://badge.fury.io/js/%40typecasting%2Frpscript-api-zip.svg)](https://badge.fury.io/js/%40typecasting%2Frpscript-api-zip) | File compression and extraction. | [Here](http://docs.rpscript.com/Zip.html)

## FAQ <img src="https://s3.amazonaws.com/sample.rpscript.com/images/smart_robot50.png" width="18px">

**What is RPScript?**

RPScript is a scripting language for process automation.

**Why do I need RPScript if I can use Python, Javascript for automation?**

Unlike general purpose languages such as Python and Javascript, RPScript has only one specific goal, process automation.

General purpose languages are powerful and flexible. However, this tends to compensate by having complicated syntax and language features. In the end, you have to deal with boilerplates and unnecessary steps that lead to complication despite only to perform a simple task.

RPScript goal is to make the syntax compact. Ideally, every action models as close to a single process as possible.

**Is it stable?**

It is currently in Alpha; I will appreciate if you can give it a try and provide your valuable feedback.

**Is rpscript a node.js library?**

RPScript is a transpiler that transpiles to javascript. It runs on top of Node.JS. 

Most, if not, all the modules are wrappers that utilize what that the npm ecosystem already provided.

## Creator <img src="https://s3.amazonaws.com/sample.rpscript.com/images/kind_robot50.png" width="20px">

**James Chong (@wei3hua2)**
[Github](https://github.com/wei3hua2)
[Twitter](https://twitter.com/wei3hua2)
[Email](mailto:james.chong@typecasting.sg)

## Changelog <img src="https://s3.amazonaws.com/sample.rpscript.com/images/cheerful_robot50.png" width="23px">

0.3.0 - Initial alpha release

## Copyright and Licence

Code released under Apache 2.0

Image created by Freepik