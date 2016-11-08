import Session from "../session";

export default async function(session: Session, { fileName }: { fileName: string }): Promise<void> {
  const command = `IOTCM "${fileName}" NonInteractive Direct (Cmd_load "${fileName}" [])`;
  const success = await session.agda.execute(fileName, command);
  if (success) {
    // FIXME: figure out a cleaner way to clear diagnostics
    const diagnostics = [];
    const uri = `file://${fileName}`;
    session.connection.sendDiagnostics({ diagnostics, uri });
    await session.agda.execute(fileName, command, { highlight: true });
  }
}
