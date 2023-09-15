import Image from "next/image";
import { trpc } from "./trpc";
import ClientSide from "./ClientSide";

export default async function Home() {
  const response = await trpc.hello.query({ name: "Artem" });
  return (
    <>
      <ClientSide />
      server side - {response}
    </>
  );
}
