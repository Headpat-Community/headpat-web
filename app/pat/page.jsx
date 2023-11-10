"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [patCount, setPatCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if JWT cookie exists
        const jwtCookie = document.cookie.replace(
          /(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );
        if (!jwtCookie || userId) {
          // If JWT cookie doesn't exist or data has already been fetched, return
          return;
        }

        // Fetch user data
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

        // Check if the data array is null or empty
        const patData = await patResponse.json();

        if (patData.data && patData.data.length === 0) {
          // Make a POST request to create data if no records are found
          console.log("Creating pat count data");
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

        // Fetch pat count again
        console.log("Fetching updated pat count data");
        const updatedPatResponse = await fetch(`/api/fun/pats/${id}`, {
          headers: {
            Authorization: `Bearer ${jwtCookie}`,
          },
        });
        const updatedPatData = await updatedPatResponse.json();

        // Extract pat count
        const count = updatedPatData?.data[0]?.attributes?.count;

        // Update state
        console.log("Before setting userId:", userId);

        setUserId(id);
        console.log("Before setting userId:", userId);

        setPatCount(count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]); // The effect now depends on userId

  return (
    <>
      <div>User ID: {userId}</div>
      <div>Pat Count: {patCount}</div>
    </>
  );
}
