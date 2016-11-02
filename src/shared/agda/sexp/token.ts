// tslint:disable class-name

import {
  Lexer,
  SimpleLazyToken,
  TokenConstructor,
} from "chevrotain";

export class DOT extends SimpleLazyToken {
  public static PATTERN = /[.]/;
}

export class FACE_BOUND extends SimpleLazyToken {
  public static PATTERN = /\bbound\b/;
}

export class FACE_COINDUCTIVE_CONSTRUCTOR extends SimpleLazyToken {
  public static PATTERN = /\bcoinductiveconstructor\b/;
}

export class FACE_COMMENT extends SimpleLazyToken {
  public static PATTERN = /\bcomment\b/;
}

export class FACE_DATA_TYPE extends SimpleLazyToken {
  public static PATTERN = /\bdatatype\b/;
}

export class FACE_DOTTED extends SimpleLazyToken {
  public static PATTERN = /\bdotted\b/;
}

export class FACE_ERROR extends SimpleLazyToken {
  public static PATTERN = /\berror\b/;
}

export class FACE_FIELD extends SimpleLazyToken {
  public static PATTERN = /\bfield\b/;
}

export class FACE_FUNCTION extends SimpleLazyToken {
  public static PATTERN = /\bfunction\b/;
}

export class FACE_INCOMPLETE_PATTERN extends SimpleLazyToken {
  public static PATTERN = /\bincompletepattern\b/;
}

export class FACE_INDUCTIVE_CONSTRUCTOR extends SimpleLazyToken {
  public static PATTERN = /\binductiveconstructor\b/;
}

export class FACE_KEYWORD extends SimpleLazyToken {
  public static PATTERN = /\bkeyword\b/;
}

export class FACE_MACRO extends SimpleLazyToken {
  public static PATTERN = /\bmacro\b/;
}

export class FACE_MODULE extends SimpleLazyToken {
  public static PATTERN = /\bmodule\b/;
}

export class FACE_NUMBER extends SimpleLazyToken {
  public static PATTERN = /\bnumber\b/;
}

export class FACE_OPERATOR extends SimpleLazyToken {
  public static PATTERN = /\boperator\b/;
}

export class FACE_POSITIVITY_PROBLEM extends SimpleLazyToken {
  public static PATTERN = /\bpositivityproblem\b/;
}

export class FACE_POSTULATE extends SimpleLazyToken {
  public static PATTERN = /\bpostulate\b/;
}

export class FACE_PRIMITIVE extends SimpleLazyToken {
  public static PATTERN = /\bprimitive\b/;
}

export class FACE_PRIMITIVE_TYPE extends SimpleLazyToken {
  public static PATTERN = /\bprimitivetype\b/;
}

export class FACE_RECORD extends SimpleLazyToken {
  public static PATTERN = /\brecord\b/;
}

export class FACE_STRING extends SimpleLazyToken {
  public static PATTERN = /\bstring\b/;
}

export class FACE_SYMBOL extends SimpleLazyToken {
  public static PATTERN = /\bsymbol\b/;
}

export class FACE_TERMINATION_PROBLEM extends SimpleLazyToken {
  public static PATTERN = /\bterminationproblem\b/;
}

export class FACE_TYPECHECKS extends SimpleLazyToken {
  public static PATTERN = /\btypechecks\b/;
}

export class FACE_UNSOLVED_CONSTRAINT extends SimpleLazyToken {
  public static PATTERN = /\bunsolvedconstraint\b/;
}

export class FACE_UNSOLVED_META extends SimpleLazyToken {
  public static PATTERN = /\bunsolvedmeta\b/;
}

export class GOALS_ACTION extends SimpleLazyToken {
  public static PATTERN = /\bagda2-goals-action\b/;
}

export class HIGHLIGHT_ADD_ANNOTATIONS extends SimpleLazyToken {
  public static PATTERN = /\bagda2-highlight-add-annotations\b/;
}

export class HIGHLIGHT_CLEAR extends SimpleLazyToken {
  public static PATTERN = /\bagda2-highlight-clear\b/;
}

export class INFO_ACTION extends SimpleLazyToken {
  public static PATTERN = /\bagda2-info-action\b/;
}

export class INTEGER extends SimpleLazyToken {
  public static PATTERN = /[\d]+/;
}

export class LAST extends SimpleLazyToken {
  public static PATTERN = /\blast\b/;
}

export class LPAREN extends SimpleLazyToken {
  public static PATTERN = /[(]/;
}

export class MAYBE_GOTO extends SimpleLazyToken {
  public static PATTERN = /\bagda2-maybe-goto\b/;
}

export class NIL extends SimpleLazyToken {
  public static PATTERN = /\bnil\b/;
}

export class QUOTE extends SimpleLazyToken {
  public static PATTERN = /'/;
}

export class RPAREN extends SimpleLazyToken {
  public static PATTERN = /[)]/;
}

export class SPACE extends SimpleLazyToken {
  public static GROUP = Lexer.SKIPPED;
  public static PATTERN = /\s+/;
}

export class STATUS_ACTION extends SimpleLazyToken {
  public static PATTERN = /\bagda2-status-action\b/;
}

export class STRING extends SimpleLazyToken {
  public static PATTERN = /["](?:\\.|[^"])*["]/;
}

export class TRUE extends SimpleLazyToken {
  public static PATTERN = /\bt\b/;
}

export const all: TokenConstructor[] = [
  DOT,
  FACE_BOUND,
  FACE_COINDUCTIVE_CONSTRUCTOR,
  FACE_COMMENT,
  FACE_DATA_TYPE,
  FACE_DOTTED,
  FACE_ERROR,
  FACE_FIELD,
  FACE_FUNCTION,
  FACE_INCOMPLETE_PATTERN,
  FACE_INDUCTIVE_CONSTRUCTOR,
  FACE_KEYWORD,
  FACE_MACRO,
  FACE_MODULE,
  FACE_NUMBER,
  FACE_OPERATOR,
  FACE_POSITIVITY_PROBLEM,
  FACE_POSTULATE,
  FACE_PRIMITIVE_TYPE,
  FACE_PRIMITIVE,
  FACE_RECORD,
  FACE_STRING,
  FACE_SYMBOL,
  FACE_TERMINATION_PROBLEM,
  FACE_TYPECHECKS,
  FACE_UNSOLVED_CONSTRAINT,
  FACE_UNSOLVED_META,
  GOALS_ACTION,
  HIGHLIGHT_ADD_ANNOTATIONS,
  HIGHLIGHT_CLEAR,
  INFO_ACTION,
  INTEGER,
  LAST,
  LPAREN,
  MAYBE_GOTO,
  NIL,
  QUOTE,
  RPAREN,
  SPACE,
  STATUS_ACTION,
  STRING,
  TRUE,
];
