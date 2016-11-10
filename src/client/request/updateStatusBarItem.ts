import { remote } from "../../shared";
import Session from "../session";

function handler(session: Session): (data: { text?: string; tooltip?: string }) => Promise<void> {
  return async (data) => {
    session.window.updateStatusBarItem(data);
  };
}

export function register(session: Session): void {
  session.languageClient.onNotification(remote.client.updateStatusBarItem, handler(session));
}
