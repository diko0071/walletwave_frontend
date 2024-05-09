import Image from "next/image";
import Playground from "./components/Playground/Playground";
import ChatHistory from "./components/Playground/ChatHistory";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { getAccessToken } from "./lib/actions";
import { getUserId } from "./lib/actions";
import RouteGuard from "./lib/RouteGuard";
import HomePage from "./components/HomePage/HomePage";

export default async function Home() {

  return (
    <div className="pl-[56px] mt-40">
        <HomePage />
    </div>
  );
}