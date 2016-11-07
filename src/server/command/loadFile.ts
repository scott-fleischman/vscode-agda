import Session from "../session";

export default async function(session: Session, { fileName }: { fileName: string }): Promise<void> {
  const command = `IOTCM "${fileName}" NonInteractive Direct (Cmd_load "${fileName}" [])`;
  await session.agda.request(fileName, command);
}