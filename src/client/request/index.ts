import Session from "../session";
import * as channelStatusAppendLine from "./channelStatusAppendLine";
import * as highlightAnnotations from "./highlightAnnotations";
import * as updateStatusBarItem from "./updateStatusBarItem";

export function registerAll(session: Session): void {
  channelStatusAppendLine.register(session);
  highlightAnnotations.register(session);
  updateStatusBarItem.register(session);
}
