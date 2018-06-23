grammar RPScript;

program
    : sourceElements? EOF
    ;

sourceElements
    : statement+
    ;

statement
    : pipeActions (NL|EOF)
    | singleAction (NL|EOF)
    | comment
    | exeFn
    | ifelseStatement
    | namedFn
    | NL
    | include NL;

statementList : statement+;

pipeActions : action PIPE action;
singleAction : action;
comment : COMMENT;

ifelseStatement : ifStatement elifStatement* elseStatement?;

ifStatement : DIRECTIVE IF singleExpression '{' statementList '}' NL*;
elifStatement : DIRECTIVE ELIF singleExpression '{' statementList '}' NL*;
elseStatement : DIRECTIVE ELSE '{' statementList '}';

//maybe replace it with $CONTEXT.$ERROR
// tryStatement : TODO


namedFn : DIRECTIVE WORD VARIABLE* block;

exeFn   : DIRECTIVE WORD param*;

include : DIRECTIVE INCLUDE StringLiteral;

action : WORD paramList optList ;

paramList : param*;
param : literal | variable | anonFn | symbol | action | singleExpression;

optList : opt*;
opt   : '--' optName ('='literal)?;

block : '{' statementList '}';

anonFn : DIRECTIVE VARIABLE* block;

singleExpression :             
    // singleExpression '.' identifierName                                                                  
      '+' singleExpression                                                   
    | '-' singleExpression                                                   
    | '!' singleExpression                                                   
    | singleExpression ('*' | '/' | '%') singleExpression                    
    | singleExpression ('+' | '-') singleExpression                          
    | singleExpression ('<' | '>' | '<=' | '>=') singleExpression            
    | singleExpression ('==' | '!=' | '===' | '!==') singleExpression        
    | singleExpression '&&' singleExpression                                 
    | singleExpression '||' singleExpression              
    | literal                                                                
    | arrayLiteral  
    | variable                                                         
    | objectLiteral;

// ARGUMENT                : '"' ('""'|~'"')* '"' | NUMBER;
// keyword : KEYWORD;
// argument : ARGUMENT;
variable : VARIABLE;
literal
    : NullLiteral | BooleanLiteral
    | StringLiteral | TemplateStringLiteral
    | DecimalLiteral;
symbol : SYMBOL;
    
optName : WORD ;
objectLiteral
    : '{' (propertyAssignment (',' propertyAssignment)*)? ','? '}';

arrayLiteral
    : '[' ','* elementList? ','* ']' ;

elementList
    : singleExpression (','+ singleExpression)* ;

propertyAssignment
    : propertyName (':' |'=') singleExpression
    | '[' singleExpression ']' ':' singleExpression
    ;
propertyName : StringLiteral | DecimalLiteral;
eos : EOF;



///////////////////  LEXER  /////////////////////


DIRECTIVE               : '@';

IF                      : 'if';
ELIF                    : 'elif';
ELSE                    : 'else';
IN                      : 'in';
INCLUDE                 : 'include';

VARIABLE                : [$] WORD ' '*;
PIPE                    : '|';

// COMMENT : ';' ~[\r\n]*;
COMMENT : ';' ~[\r\n]* -> channel(HIDDEN);


NullLiteral: 'null';
BooleanLiteral: 'true' | 'false';
DecimalLiteral: 
       DecimalIntegerLiteral '.' [0-9]* ExponentPart?
    |  '.' [0-9]+ ExponentPart?
    |  DecimalIntegerLiteral ExponentPart? ;

StringLiteral:                 ('"' DoubleStringCharacter* '"'
             |                  '\'' SingleStringCharacter* '\'')
             ;

TemplateStringLiteral:          '`' ('\\`' | ~'`')* '`';

// KEYWORD  : [a-z][a-zA-Z0-9.]*;
SYMBOL  : [A-Z][a-zA-Z0-9.]*;
WORD  : [a-zA-Z0-9]+;

fragment DoubleStringCharacter       : ~["\\\r\n] | LineContinuation ;
fragment SingleStringCharacter       : ~['\\\r\n] | LineContinuation ;
fragment LineContinuation            : '\\' [\r\n\u2028\u2029] ;
fragment DecimalIntegerLiteral       : '0' | [1-9] [0-9]* ;
fragment ExponentPart                : [eE] [+-]? [0-9]+ ;

NL : '\r'? '\n';

// WS : [ \t\r\n]+ -> skip ;
WS : [ \t]+ -> skip ;
