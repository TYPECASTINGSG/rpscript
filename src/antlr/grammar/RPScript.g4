grammar RPScript;

program
    : sourceElements? EOF
    ;

sourceElements
    : statement+
    ;

statement
    : block
    | pipeActions
    | singleAction
    | comment
    | ifStatement
    | switchStatement
    | namedFn;

statementList : statement+;
pipeActions : action (PIPE action)+;
singleAction : action;
comment : COMMENT;
ifStatement : DIRECTIVE IF '(' singleExpression ')' statement (DIRECTIVE ELSE statement)?;
switchStatement : DIRECTIVE SWITCH '(' singleExpression ')' caseBlock;
    
namedFn : DIRECTIVE WORD VARIABLE* block;

action : WORD paramList optList ;

paramList : param*;
param : literal | variable | anonFn | symbol;

optList : opt*;
opt   : '--' optName ('='literal)?;

block : '{' statementList '}';

caseBlock
    : '{' caseClauses? (defaultClause caseClauses?)? '}' ;

caseClauses : caseClause+;
caseClause : DIRECTIVE CASE WORD ':' statementList? ;
defaultClause : DIRECTIVE DEFAULT ':' statementList? ;

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
ELSE                    : 'else';
SWITCH                  : 'switch';
CASE                    : 'case';
DEFAULT                  : 'default';
FOR                     : 'for';
IN                      : 'in';
IMPORT                  : 'import';

// ACTION                 : [a-z][a-zA-Z0-9]*;
VARIABLE                : [$] WORD ' '*;
PIPE                    : '|';

COMMENT : ';' ~[\r\n]*;


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

WS : [ \t\r\n]+ -> skip ;
