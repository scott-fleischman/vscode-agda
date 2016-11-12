import { remote, types } from "../../shared";
import Session from "./index";
import * as lodash from "lodash";

export default class Annotator {
  private readonly session: Session;
  private annotations: Map<string, remote.client.IAnnotation[]> = new Map();
  private sendAnnotationsDebounced: ((data: remote.client.IFileAnnotations) => void) & _.Cancelable;

  constructor(session: Session) {
    this.session = session;
    this.sendAnnotationsDebounced = lodash.debounce((data: remote.client.IFileAnnotations) =>  this.session.connection.sendNotification(remote.client.highlightAnnotations, data), 0, { trailing: true });
    return this;
  }

  public clear({ uri }: types.TextDocumentIdentifier): boolean {
    return this.annotations.delete(uri);
  }

  public getAnnotations({ uri }: types.TextDocumentIdentifier): remote.client.IAnnotation[] {
    return this.annotations.get(uri) || [];
  }

  public pushAnnotations(textDocument: types.TextDocumentIdentifier, rest: remote.client.IAnnotation[]): void {
    if (!this.annotations.has(textDocument.uri)) this.annotations.set(textDocument.uri, []);
    const annotations = this.annotations.get(textDocument.uri) as remote.client.IAnnotation[];
    Array.prototype.push.apply(annotations, rest);
    this.sendAnnotationsDebounced({ textDocument, annotations });
  }

  public setAnnotations(textDocument: types.TextDocumentIdentifier, annotations: remote.client.IAnnotation[]): void {
    this.annotations.set(textDocument.uri, annotations);
    this.session.connection.sendNotification(remote.client.highlightAnnotations, { textDocument, annotations });
  }
}
