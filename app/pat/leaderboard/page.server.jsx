"use server";
export const getLeaderboardData = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/pats?populate=*`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  const usersData = [];

  for (const item of data.data) {
    const userId = item.attributes.users_permissions_user.data.id;
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/user-data/${userId}?populate=avatar`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
          "Content-Type": "application/json",
        },
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

  return usersData;
};
