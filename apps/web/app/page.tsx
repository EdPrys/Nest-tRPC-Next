import { trpc } from "./trpc";
import Clientside from "./ClientSide";

export default async function Home() {
  const response = await trpc.hello.query({ name: "Artem" });
  return (
    <>
      <Clientside />
      server side - {response}
    </>
  );
}
