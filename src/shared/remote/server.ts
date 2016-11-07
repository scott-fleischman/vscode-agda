import * as rpc from "vscode-jsonrpc";

export const loadFile: rpc.NotificationType<{ fileName: string }> = {
  method: "agda.server.loadFile",
};
