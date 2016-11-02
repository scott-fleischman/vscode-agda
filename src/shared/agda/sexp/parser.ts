// tslint:disable object-literal-sort-keys

import * as token from "./token";
import * as chevrotain from "chevrotain";

export default class Parser extends chevrotain.Parser {
  command = this.RULE("command", () => {
    this.CONSUME(token.LPAREN);
    this.OR([
      { ALT: () => this.SUBRULE(this.highlightAddAnnotations) },
      { ALT: () => this.SUBRULE(this.highlightClear) },
      { ALT: () => this.SUBRULE(this.goalsAction) },
      { ALT: () => this.SUBRULE(this.infoAction) },
      { ALT: () => this.SUBRULE(this.statusAction) },
    ]);
    this.CONSUME(token.RPAREN);
  });

  highlightAnnotation = this.RULE("highlightAnnotation", () => {
    this.CONSUME(token.QUOTE);
    this.CONSUME1(token.LPAREN);
    this.CONSUME1(token.INTEGER);
    this.CONSUME2(token.INTEGER);
    this.SUBRULE(this.highlightAnnotationKind);
    this.OR([
      { ALT: () => this.CONSUME(token.NIL) },
    ]);
    this.OPTION(() => {
      this.CONSUME2(token.LPAREN);
      this.CONSUME(token.STRING);
      this.CONSUME(token.DOT);
      this.CONSUME3(token.INTEGER);
      this.CONSUME1(token.RPAREN);
    });
    this.CONSUME2(token.RPAREN);
  });

  highlightAnnotationKind = this.RULE("highlightAnnotationKind", () => {
    this.CONSUME(token.LPAREN);
    this.OR([
      { ALT: () => this.CONSUME(token.DATATYPE) },
      { ALT: () => this.CONSUME(token.INDUCTIVECONSTRUCTOR) },
      { ALT: () => this.CONSUME(token.KEYWORD) },
      { ALT: () => this.CONSUME(token.MODULE) },
      { ALT: () => this.CONSUME(token.PRIMITIVETYPE) },
      { ALT: () => this.CONSUME(token.SYMBOL) },
    ]);
    this.CONSUME(token.RPAREN);
  });

  highlightAddAnnotations = this.RULE("highlightAddAnnotations", () => {
    this.CONSUME(token.HIGHLIGHT_ADD_ANNOTATIONS);
    this.MANY(() => this.SUBRULE(this.highlightAnnotation));
  });

  highlightClear = this.RULE("highlightClear", () => {
    this.CONSUME(token.HIGHLIGHT_CLEAR);
  });

  goalsAction = this.RULE("goalsAction", () => {
    this.CONSUME(token.GOALS_ACTION);
    this.CONSUME(token.QUOTE);
    this.CONSUME(token.LPAREN);
    // FIXME: payload
    this.CONSUME(token.RPAREN);
  })

  infoAction = this.RULE("infoAction", () => {
    this.CONSUME(token.INFO_ACTION);
    this.CONSUME1(token.STRING);
    this.CONSUME2(token.STRING);
    this.OR([
      { ALT: () => this.CONSUME(token.NIL) },
      { ALT: () => this.CONSUME(token.TRUE) },
    ]);
  });

  statusAction = this.RULE("statusAction", () => {
    this.CONSUME(token.STATUS_ACTION);
    this.CONSUME(token.STRING);
  });

  constructor(input: chevrotain.Token[]) {
    super(input, token.all);
    chevrotain.Parser.performSelfAnalysis(this);
    return this;
  }
}
