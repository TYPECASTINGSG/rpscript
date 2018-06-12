grammar Rps;

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
