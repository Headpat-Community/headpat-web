"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [patCount, setPatCount] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtCookie = document.cookie.replace(
          /(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

        // Fetch data from /api/fun/pats regardless of whether the user is logged in
        const patsResponse = await fetch("/api/fun/pats");
        const patsData = await patsResponse.json();

        // Calculate the total count from the fetched data
        const totalCount = patsData.data.reduce(
          (acc, pat) => acc + Number(pat.attributes.count),
          0
        );

        // Update state
        setTotalCount(totalCount);

        if (jwtCookie) {
          // If JWT cookie exists, fetch user-specific data
          const userResponse = await fetch("/api/user/getUserSelf", {
            method: "GET",
          });
          const userData = await userResponse.json();

          if (!userData) {
            return;
          }

          // Extract user ID
          const { id } = userData;

          // Fetch pat count using user ID
          const patResponse = await fetch(`/api/fun/pats/${id}`, {
            method: "GET",
          });

          const patData = await patResponse.json();

          if (patData.data && patData.data.length === 0) {
            await fetch("/api/fun/pats/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  users_permissions_user: id,
                },
              }),
            });
          }

          const updatedPatResponse = await fetch(`/api/fun/pats/${id}`, {
            headers: {
              Authorization: `Bearer ${jwtCookie}`,
            },
          });
          const updatedPatData = await updatedPatResponse.json();

          const count = updatedPatData?.data[0]?.attributes?.count;

          setUserId(id);
          setPatCount(count);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleIncrement = async () => {
    try {
      const currentPatResponse = await fetch(`/api/fun/pats/${userId}`);
      const currentPatData = await currentPatResponse.json();
      const patId = currentPatData?.data[0]?.id;

      const currentCount = Number(currentPatData?.data[0]?.attributes?.count);
      const newCount = currentCount + 1;

      await fetch(`/api/fun/pats/update/${patId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            count: newCount,
          },
        }),
      });

      // Fetch the total count again and update the state
      const updatedTotalResponse = await fetch("/api/fun/pats");
      const updatedTotalData = await updatedTotalResponse.json();
      const updatedTotalCount = updatedTotalData.data.reduce(
        (acc, pat) => acc + Number(pat.attributes.count),
        0
      );

      setTotalCount(updatedTotalCount);
      setPatCount(newCount);
    } catch (error) {
      console.error("Error incrementing count:", error);
    }
  };

  return (
    <>
      <div>User ID: {userId}</div>
      <div>Pat Count: {patCount}</div>
      <div>Total Count: {totalCount}</div>
      <img onClick={handleIncrement} src="/logos/Headpat_new_logo.png" alt="pat" className="transition active:scale-75 transition-transform" />
    </>
  );
}
