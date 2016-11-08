import { remote, types } from "../../shared";
import Session from "../session";

export default async function(session: Session, id: types.TextDocumentIdentifier): Promise<remote.client.IAnnotation[]> {
  return session.synchronizer.getAnnotations(id);
}
