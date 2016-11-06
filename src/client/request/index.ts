import Session from "../session";
import * as highlightAnnotations from "./highlightAnnotations";

export function registerAll(session: Session): void {
  highlightAnnotations.register(session);
}
