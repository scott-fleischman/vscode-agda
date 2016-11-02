// tslint:disable class-name

import {
  Lexer,
  SimpleLazyToken,
  TokenConstructor,
} from "chevrotain";

export class DATATYPE extends SimpleLazyToken {
  public static PATTERN = /\bdatatype\b/;
}

export class DOT extends SimpleLazyToken {
  public static PATTERN = /[.]/;
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

export class INDUCTIVECONSTRUCTOR extends SimpleLazyToken {
  public static PATTERN = /\binductiveconstructor\b/;
}

export class INFO_ACTION extends SimpleLazyToken {
  public static PATTERN = /\bagda2-info-action\b/;
}

export class INTEGER extends SimpleLazyToken {
  public static PATTERN = /[\d]+/;
}

export class KEYWORD extends SimpleLazyToken {
  public static PATTERN = /\bkeyword\b/;
}

export class LAST extends SimpleLazyToken {
  public static PATTERN = /\blast\b/;
}

export class LPAREN extends SimpleLazyToken {
  public static PATTERN = /[(]/;
}

export class MODULE extends SimpleLazyToken {
  public static PATTERN = /\bmodule\b/;
}

export class NIL extends SimpleLazyToken {
  public static PATTERN = /\bnil\b/;
}

export class PRIMITIVETYPE extends SimpleLazyToken {
  public static PATTERN = /\bprimitivetype\b/;
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

export class SYMBOL extends SimpleLazyToken {
  public static PATTERN = /\bsymbol\b/;
}

export class TRUE extends SimpleLazyToken {
  public static PATTERN = /\bt\b/;
}

export const all: TokenConstructor[] = [
  DATATYPE,
  DOT,
  GOALS_ACTION,
  HIGHLIGHT_ADD_ANNOTATIONS,
  HIGHLIGHT_CLEAR,
  INDUCTIVECONSTRUCTOR,
  INFO_ACTION,
  INTEGER,
  KEYWORD,
  LAST,
  LPAREN,
  MODULE,
  NIL,
  PRIMITIVETYPE,
  QUOTE,
  RPAREN,
  SPACE,
  STATUS_ACTION,
  STRING,
  SYMBOL,
  TRUE,
];
