import { remote, types } from "../../shared";
import Session from "./index";

export default class Annotator {
  private readonly session: Session;
  private annotations: Map<string, remote.client.IAnnotation[]> = new Map();

  constructor(session: Session) {
    this.session = session;
    return this;
  }

  public clear({ uri }: types.TextDocumentIdentifier): boolean {
    return this.annotations.delete(uri);
  }

  public getAnnotations({ uri }: types.TextDocumentIdentifier): remote.client.IAnnotation[] {
    return this.annotations.get(uri) || [];
  }

  public setAnnotations(textDocument: types.TextDocumentIdentifier, annotations: remote.client.IAnnotation[]): void {
    this.annotations.set(textDocument.uri, annotations);
    this.session.connection.sendNotification(remote.client.highlightAnnotations, { textDocument, annotations });
  }
}
