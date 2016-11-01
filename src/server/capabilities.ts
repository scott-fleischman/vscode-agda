import * as server from "vscode-languageserver";

const capabilities: server.ServerCapabilities = {
  codeActionProvider: false,
  codeLensProvider: undefined, // { resolveProvider: false }
  completionProvider: undefined, // { resolveProvider: false, triggerCharacters: [] },
  definitionProvider: false,
  documentFormattingProvider: false,
  documentHighlightProvider: false,
  documentRangeFormattingProvider: false,
  documentSymbolProvider: false,
  hoverProvider: false,
  referencesProvider: false,
  renameProvider: false,
  textDocumentSync: server.TextDocumentSyncKind.Full,
  workspaceSymbolProvider: false,
};

export default capabilities;
