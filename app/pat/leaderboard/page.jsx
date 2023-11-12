import Header from "@/components/header";
import Footer from "@/components/footer";
import Client from "./page.client";

export const metadata = {
  title: "Headpat Clicker Leaderboard",
  description: "Headpat clicker Leaderboard für Headpawties!",
};

export default function PatLeaderBoard() {
  return (
    <>
      <Header />
      <Client />
      <Footer />
    </>
  );
}
