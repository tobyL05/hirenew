import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export default async function Page({ params }: { params: { uid: string } }) {
  const accessToken = await getHumeAccessToken();
  const { uid } = params;

  if (!accessToken) {
    throw new Error();
  }

  return (
    <div className={"grow flex flex-col"}>
      {/* <h1>Interview for UID: {uid}</h1> */}
      <Chat accessToken={accessToken} uid={uid} />
    </div>
  );
}