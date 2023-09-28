import { trpc } from "./trpc";
// import Clientside from "./ClientSide";

export default async function Home() {
  const postQuery = await trpc.post.all.query()

  console.log("postQuery", postQuery);
  return (
    <>
      {/* <Clientside /> */}
      server side - {postQuery[2].content}
    </>
  );
}
