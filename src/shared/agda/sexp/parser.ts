// tslint:disable object-literal-sort-keys

import { remote } from "../../../shared";
import Session from "../../../server/session";
import * as token from "./token";
import * as chevrotain from "chevrotain";

export default class Parser extends chevrotain.Parser {
  private readonly fileName: string;
  private readonly session: Session;

  constructor(session: Session, fileName: string, input: chevrotain.Token[]) {
    super(input, token.all);
    this.fileName = fileName;
    this.session = session;
    chevrotain.Parser.performSelfAnalysis(this);
    return this;
  }

  public command = this.RULE("command", () => {
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

  public highlightAnnotation = this.RULE("highlightAnnotation", () => {
    this.CONSUME(token.QUOTE);
    this.CONSUME1(token.LPAREN);
    const start = this.CONSUME1(token.INTEGER);
    const end = this.CONSUME2(token.INTEGER);
    const kind = this.SUBRULE(this.highlightAnnotationKind);
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
    return {
      fileName: this.fileName,
      startOff: parseInt(chevrotain.getImage(start)) - 1,
      endOff: parseInt(chevrotain.getImage(end)) - 1,
      face: chevrotain.getImage(kind) as remote.client.HighlightFace,
    };
  });

  public highlightAnnotationKind = this.RULE("highlightAnnotationKind", () => {
    this.CONSUME(token.LPAREN);
    const kind = this.OR([
      { ALT: () => this.CONSUME(token.FACE_BOUND) },
      { ALT: () => this.CONSUME(token.FACE_COINDUCTIVE_CONSTRUCTOR) },
      { ALT: () => this.CONSUME(token.FACE_COMMENT) },
      { ALT: () => this.CONSUME(token.FACE_DATA_TYPE) },
      { ALT: () => this.CONSUME(token.FACE_DOTTED) },
      { ALT: () => this.CONSUME(token.FACE_ERROR) },
      { ALT: () => this.CONSUME(token.FACE_FIELD) },
      { ALT: () => this.CONSUME(token.FACE_FUNCTION) },
      { ALT: () => this.CONSUME(token.FACE_INCOMPLETE_PATTERN) },
      { ALT: () => this.CONSUME(token.FACE_INDUCTIVE_CONSTRUCTOR) },
      { ALT: () => this.CONSUME(token.FACE_KEYWORD) },
      { ALT: () => this.CONSUME(token.FACE_MACRO) },
      { ALT: () => this.CONSUME(token.FACE_MODULE) },
      { ALT: () => this.CONSUME(token.FACE_NUMBER) },
      { ALT: () => this.CONSUME(token.FACE_OPERATOR) },
      { ALT: () => this.CONSUME(token.FACE_POSITIVITY_PROBLEM) },
      { ALT: () => this.CONSUME(token.FACE_POSTULATE) },
      { ALT: () => this.CONSUME(token.FACE_PRIMITIVE) },
      { ALT: () => this.CONSUME(token.FACE_PRIMITIVE_TYPE) },
      { ALT: () => this.CONSUME(token.FACE_RECORD) },
      { ALT: () => this.CONSUME(token.FACE_STRING) },
      { ALT: () => this.CONSUME(token.FACE_SYMBOL) },
      { ALT: () => this.CONSUME(token.FACE_TERMINATION_PROBLEM) },
      { ALT: () => this.CONSUME(token.FACE_TYPECHECKS) },
      { ALT: () => this.CONSUME(token.FACE_UNSOLVED_CONSTRAINT) },
      { ALT: () => this.CONSUME(token.FACE_UNSOLVED_META) },
    ]);
    this.CONSUME(token.RPAREN);
    return kind;
  });

  public highlightAddAnnotations = this.RULE("highlightAddAnnotations", () => {
    const fileName = this.fileName;
    const annotations: remote.client.IAnnotation[] = [];
    this.CONSUME(token.HIGHLIGHT_ADD_ANNOTATIONS);
    this.MANY(() => annotations.push(this.SUBRULE(this.highlightAnnotation)));
    this.session.connection.sendNotification(remote.client.highlightAnnotations, { fileName, annotations });
  });

  public highlightClear = this.RULE("highlightClear", () => {
    this.CONSUME(token.HIGHLIGHT_CLEAR);
  });

  public goalsAction = this.RULE("goalsAction", () => {
    this.CONSUME(token.GOALS_ACTION);
    this.CONSUME(token.QUOTE);
    this.CONSUME(token.LPAREN);
    // FIXME: payload
    this.CONSUME(token.RPAREN);
  })

  public infoAction = this.RULE("infoAction", () => {
    this.CONSUME(token.INFO_ACTION);
    this.CONSUME1(token.STRING);
    this.CONSUME2(token.STRING);
    this.OR([
      { ALT: () => this.CONSUME(token.NIL) },
      { ALT: () => this.CONSUME(token.TRUE) },
    ]);
  });

  public statusAction = this.RULE("statusAction", () => {
    this.CONSUME(token.STATUS_ACTION);
    this.CONSUME(token.STRING);
  });
}
