// tslint:disable no-console

import { remote } from "../shared";
import * as lifecycle from "./lifecycle";
import * as request from "./request";
import Session from "./session";

const session = new Session();
session.connection.onExit(lifecycle.exit(session));
session.connection.onInitialize(lifecycle.initialize(session));
session.connection.onShutdown(lifecycle.shutdown(session));
session.connection.onNotification(remote.server.load, request.loadFile(session));
// session.connection.onCodeAction(async () => {
//   session.connection.console.log("onCodeAction");
//   return [];
// });
// session.connection.onCodeLens(async () => {
//   session.connection.console.log("onCodeLens");
//   return [];
// });
// session.connection.onCodeLensResolve(async () => {
//   session.connection.console.log("onCodeLensResolve");
//   return;
// });
// session.connection.onCompletion(async () => {
//   session.connection.console.log("onCompletion");
//   return [];
// });
// session.connection.onCompletionResolve(async () => {
//   session.connection.console.log("onCompletionResolve");
//   return;
// });
// session.connection.onDefinition(async () => {
//   session.connection.console.log("onDefinition");
//   return [];
// });
// session.connection.onDidChangeConfiguration(async () => {
//   session.connection.console.log("onDidChangeConfiguration");
//   return;
// });
// session.connection.onDidChangeTextDocument(async () => {
//   session.connection.console.log("onDidChangeTextDocument");
//   return;
// });
// session.connection.onDidChangeWatchedFiles(async () => {
//   session.connection.console.log("onDidChangeWatchedFiles");
//   return;
// });
// session.connection.onDidCloseTextDocument(async () => {
//   session.connection.console.log("onDidCloseTextDocument");
//   return;
// });
// session.connection.onDidOpenTextDocument(async () => {
//   session.connection.console.log("onDidOpenTextDocument");
//   return;
// });
// session.connection.onDidSaveTextDocument(async () => {
//   session.connection.console.log("onDidSaveTextDocument");
//   return;
// });
// session.connection.onDocumentFormatting(async () => {
//   session.connection.console.log("onDocumentFormatting");
//   return [];
// });
// session.connection.onDocumentHighlight(async () => {
//   session.connection.console.log("onDocumentHighlight");
//   return [];
// });
// session.connection.onDocumentOnTypeFormatting(async () => {
//   session.connection.console.log("onDocumentOnTypeFormatting");
//   return [];
// });
// session.connection.onDocumentRangeFormatting(async () => {
//   session.connection.console.log("onDocumentRangeFormatting");
//   return [];
// });
// session.connection.onDocumentSymbol(async () => {
//   session.connection.console.log("onDocumentSymbol");
//   return [];
// });
// session.connection.onHover(async () => {
//   session.connection.console.log("onHover");
//   return;
// });
// session.connection.onReferences(async () => {
//   session.connection.console.log("onReferences");
//   return [];
// });
// session.connection.onRenameRequest(async () => {
//   session.connection.console.log("onRenameRequest");
//   return;
// });
// session.connection.onSignatureHelp(async () => {
//   session.connection.console.log("onSignatureHelp");
//   return;
// });
// session.connection.onWorkspaceSymbol(async () => {
//   session.connection.console.log("onWorkspaceSymbols");
//   return [];
// });
session.listen();
