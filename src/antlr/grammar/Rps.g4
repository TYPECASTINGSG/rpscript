grammar Rps;

// function declaration : @ {}
// expression : keyword "abc" 1 , map $RESULT @{}
// directive:  @if{} @else if {} @else {} @forEach @while
// variable: $RESULT , $item
// pipeline: read "txt.csv" | print
// write/append: read "txt.csv" > "temp.txt" , read "txt.csv" >> "temp.txt", read "txt.csv" > $item
// literal: 151 , 41.4 , ["a","b"] , {"a":1, "b":2} , "double quote" , 'single quote' , `backtick`

// import source file
// manual import library
// common sense assumption

//pipeline is expression ('|' expression)*

// expression is <keyword> <param?...> <opt?...>
// KEYWORD = [a-z][a-zA-Z0-9]+
// PARAM = string | number | variable | [] | {}
//OPT = -input="value1" --b

// directive is @<name?> <params?...> {  }
// name = if | else if | else | switch   or genericfunctionName or nothing for anonymous function
// scope by { }

//LEXER
// KEYWORD , VARIABLE , DIRECTIVE , SCOPE , STRING , NUMBER , ARRAY , OBJECT , > , >> , |



file : statement*;

//statement : (control | expression)+ comment? '\r'? '\n';
statement : (expression+ | unknown) '\r'? '\n';

//control   : KEYWORD (argument | variable)* ;
expression : CAP_STRING (argument | variable)* ;
unknown : WILDSTRING ;

function : FUNCTION;
//keyword  : KEYWORD;

variable : VARIABLE;
argument : ARGUMENT;
comment : COMMT ;

//KEYWORD                 : '.' RESERVED ' '*;
FUNCTION                : STRING '.' ' '*;
VARIABLE                : [$] STRING ' '*;

CAP_STRING : [A-Z] STRING;
ARGUMENT                : '"' ('""'|~'"')* '"' | NUMBER;
STRING  : [a-zA-Z0-9]+;
NUMBER  : [0-9]+;
WILDSTRING : [a-z] ~[\r\n]*;
COMMT : ';' ~[\r\n]*;

WS : [ \t\r\n]+ -> skip ;
