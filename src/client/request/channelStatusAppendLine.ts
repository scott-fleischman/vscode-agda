import { remote } from "../../shared";
import Session from "../session";

function handler(session: Session): (data: string) => Promise<void> {
  return async (data) => {
    session.window.channelStatusAppendLine(data);
  };
}

export function register(session: Session): void {
  session.languageClient.onNotification(remote.client.channelStatusAppendLine, handler(session));
}
