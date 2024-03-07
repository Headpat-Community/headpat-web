import Client from "./page.client";
import Loading from "../../../loading";
import { Suspense } from "react";

export const metadata = {
  title: "Headpat Clicker Leaderboard",
  description: "Headpat clicker Leaderboard für Headpawties!",
};

export const runtime = "edge";

export default async function PatLeaderBoard() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </>
  );
}
