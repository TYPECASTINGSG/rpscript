# RP Script

A simple scripting language for your task automation.

### This project is still Work-In-Progress. It is still subject to changes.

### I am currently preparing the documentation. Please watch out for more updates.


## Install

Prerequisite: NodeJS

```
npm i -g rpscript
```
This will install a global command line in your machine.

Let's install 2 modules: basic.
```
rps install basic
```

Create a file "helloworld.rps" and add the statement:
```
log repeat "hello world " 3
```




## Getting Started With Fancy Ascii Art

Install 3 more modules for file downloading, ascii art and file operations respectively.
```
rps install downloading figlet file
```

Start by create another file name "ascii.rps" and copy and paste the lines below to the file.

```
download "." "https://s3.amazonaws.com/sample.rpscript.com/figlet/all-fonts.txt"

split "\n" read-file "all-fonts.txt" | as 'fonts'

for-each ($val)=> (wait 1 log concat `== ${$val} ==\n` figlet --font=$val "RPScript") $fonts
```

The first line downloads the list of fonts provided by figlet.

Follow by splitting the file content by newline.

The last line iterate the list of fonts and print out fanciful ascii text with a wait period of 1 second.

