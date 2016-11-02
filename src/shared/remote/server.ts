import * as rpc from "vscode-jsonrpc";

export const load: rpc.NotificationType<{ fileName: string }> = {
  method: "agda.server.load",
};
