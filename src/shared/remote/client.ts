import * as rpc from "vscode-jsonrpc";

export type HighlightFace
  = "bound"
  | "coinductiveconstructor"
  | "comment"
  | "datatype"
  | "dotted"
  | "error"
  | "field"
  | "function"
  | "incompletepattern"
  | "inductiveconstructor"
  | "keyword"
  | "macro"
  | "module"
  | "number"
  | "operator"
  | "positivityproblem"
  | "postulate"
  | "primitive"
  | "primitivetype"
  | "record"
  | "string"
  | "symbol"
  | "terminationproblem"
  | "typechecks"
  | "unsolvedconstraint"
  | "unsolvedmeta"
  ;

export interface IAnnotation {
  startOff: number;
  endOff: number;
  face: HighlightFace;
}

export interface IFileAnnotations {
  fileName: string;
  annotations: IAnnotation[];
}

export const highlightAnnotations: rpc.NotificationType<IFileAnnotations> = {
  method: "agda.client.highlightAnnotations",
};
