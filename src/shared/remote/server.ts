import * as types from "../types";
import * as client from "./client";
import * as rpc from "vscode-jsonrpc";

export const loadFile: rpc.NotificationType<{ fileName: string }> = {
  method: "agda/server/loadFile",
};

export const giveAnnotations: rpc.RequestType<types.TextDocumentIdentifier, client.IAnnotation[], void> = {
  method: "agda/server/giveAnnotations",
};
