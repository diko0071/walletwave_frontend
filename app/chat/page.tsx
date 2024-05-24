import Image from "next/image";
import { Chat } from "../components/Chat/Chat";

export default async function Home() {

  return (
    <div className="pl-[56px] mt-5">
        <Chat />
    </div>
  );
}