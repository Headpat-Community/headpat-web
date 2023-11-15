import Header from "@/components/header";
import Footer from "@/components/footer";
import Client from "./page.client";
import Loading from "@/app/loading";
import { Suspense } from "react";

export const metadata = {
  title: "Headpat Clicker Leaderboard",
  description: "Headpat clicker Leaderboard für Headpawties!",
};

export default async function PatLeaderBoard() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/fun/pats?populate=*`,
    {
      method: "GET",
      next: { revalidate: 60 },
    }
  );
  const data = await response.json();
  const usersData = [];

  for (const item of data.data) {
    const userId = item.attributes.users_permissions_user.data.id;
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/getUserData/${userId}?populate=avatar`,
      {
        method: "GET",
        next: { revalidate: 300 },
      }
    );
    const userData = await userResponse.json();

    const displayName =
      userData.data.attributes.displayname ||
      item.attributes.users_permissions_user.data.attributes.username;

    usersData.push({
      id: item.id,
      count: item.attributes.count,
      userId: userId,
      username: item.attributes.users_permissions_user.data.attributes.username,
      displayName: displayName,
      image:
        userData.data?.attributes?.avatar?.data?.attributes?.url ||
        "/logos/logo-64.webp",
      lastclicked: new Date(item.attributes.updatedAt).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    });
  }

  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <Client usersData={usersData} />
      </Suspense>
      <Footer />
    </>
  );
}
