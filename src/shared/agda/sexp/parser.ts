// tslint:disable object-literal-sort-keys

import Session from "../../../server/session";
import { remote } from "../../../shared";
import * as token from "./token";
import * as chevrotain from "chevrotain";

export default class Parser extends chevrotain.Parser {
  public command = this.RULE("command", () => {
    this.CONSUME(token.DELIM_LPAREN);
    this.OR([
      { ALT: () => this.SUBRULE(this.highlightAddAnnotations) },
      // { ALT: () => this.SUBRULE(this.highlightAndDeleteAction) },
      { ALT: () => this.SUBRULE(this.highlightClear) },
      { ALT: () => this.SUBRULE(this.goalsAction) },
      { ALT: () => this.SUBRULE(this.infoAction) },
      { ALT: () => this.SUBRULE(this.statusAction) },
    ]);
    this.CONSUME(token.DELIM_RPAREN);
  });

  // public highlightAndDeleteAction = this.RULE("highlightAndDeleteAction", async () => {
  //   this.CONSUME(token.SYMBOL_AGDA2_HIGHLIGHT_AND_DELETE_ACTION);
  //   const fileNameToken = this.CONSUME(token.LITERAL_STRING);
  //   const fileName = chevrotain.getImage(fileNameToken);
  //   this.session.connection.console.log(fileName);
  // });

  public highlightAnnotation = this.RULE("highlightAnnotation", () => {
    this.CONSUME(token.SYMBOL_QUOTE);
    this.CONSUME1(token.DELIM_LPAREN);
    const start = this.CONSUME1(token.LITERAL_INTEGER);
    const end = this.CONSUME2(token.LITERAL_INTEGER);
    const kind = this.SUBRULE(this.highlightAnnotationKind);
    this.OR([
      { ALT: () => this.CONSUME(token.SYMBOL_NIL) },
    ]);
    this.OPTION(() => {
      this.CONSUME2(token.DELIM_LPAREN);
      this.CONSUME(token.LITERAL_STRING);
      this.CONSUME(token.DELIM_DOT);
      this.CONSUME3(token.LITERAL_INTEGER);
      this.CONSUME1(token.DELIM_RPAREN);
    });
    this.CONSUME2(token.DELIM_RPAREN);
    return {
      fileName: this.fileName,
      startOff: parseInt(chevrotain.getImage(start), 10) - 1,
      endOff: parseInt(chevrotain.getImage(end), 10) - 1,
      face: chevrotain.getImage(kind) as remote.client.HighlightFace,
    };
  });

  public highlightAnnotationKind = this.RULE("highlightAnnotationKind", () => {
    this.CONSUME(token.DELIM_LPAREN);
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
    this.CONSUME(token.DELIM_RPAREN);
    return kind;
  });

  public highlightAddAnnotations = this.RULE("highlightAddAnnotations", () => {
    const fileName = this.fileName;
    const annotations: remote.client.IAnnotation[] = [];
    this.CONSUME(token.SYMBOL_AGDA2_HIGHLIGHT_ADD_ANNOTATIONS);
    this.MANY(() => annotations.push(this.SUBRULE(this.highlightAnnotation)));
    this.session.connection.sendNotification(remote.client.highlightAnnotations, { fileName, annotations });
  });

  public highlightClear = this.RULE("highlightClear", () => {
    this.CONSUME(token.SYMBOL_AGDA2_HIGHLIGHT_CLEAR);
  });

  public goalsAction = this.RULE("goalsAction", () => {
    this.CONSUME(token.SYMBOL_AGDA2_GOALS_ACTION);
    this.CONSUME(token.SYMBOL_QUOTE);
    this.CONSUME(token.DELIM_LPAREN);
    // FIXME: payload
    this.CONSUME(token.DELIM_RPAREN);
  });

  public infoAction = this.RULE("infoAction", () => {
    this.CONSUME(token.SYMBOL_AGDA2_INFO_ACTION);
    this.CONSUME1(token.LITERAL_STRING);
    this.CONSUME2(token.LITERAL_STRING);
    this.OR([
      { ALT: () => this.CONSUME(token.SYMBOL_NIL) },
      { ALT: () => this.CONSUME(token.SYMBOL_TRUE) },
    ]);
  });

  public statusAction = this.RULE("statusAction", () => {
    this.CONSUME(token.SYMBOL_AGDA2_STATUS_ACTION);
    this.CONSUME(token.LITERAL_STRING);
  });

  private readonly fileName: string;
  private readonly session: Session;

  constructor(session: Session, fileName: string, input: chevrotain.Token[]) {
    super(input, token.all);
    this.fileName = fileName;
    this.session = session;
    chevrotain.Parser.performSelfAnalysis(this);
    return this;
  }
}
