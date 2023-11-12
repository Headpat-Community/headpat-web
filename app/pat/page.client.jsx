"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { createPatData } from "./page.api";  // Adjust the path based on your project structure
import { BellIcon } from "@heroicons/react/24/outline";

const PATS_API = "/api/fun/pats";
const USER_API = "/api/user/getUserSelf";

export default function PatClient() {
  const [userId, setUserId] = useState(null);
  const [patCount, setPatCount] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  const fetchUserData = useCallback(async (jwtCookie) => {
    try {
      const userResponse = await fetch(USER_API, {
        method: "GET",
      });
      const userData = await userResponse.json();

      if (!userData) {
        return;
      }

      const { id } = userData;
      await fetchPatData(id, jwtCookie);
    } catch (error) {
      handleFetchError(error);
    }
  }, []);

  const fetchPatData = useCallback(async (id, jwtCookie) => {
    const patResponse = await fetch(`${PATS_API}/${id}`, {
      method: "GET",
    });

    const patData = await patResponse.json();

    if (patData.data && patData.data.length === 0) {
      await createPatData(id);
    }

    const updatedPatResponse = await fetch(`${PATS_API}/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtCookie}`,
      },
    });

    const updatedPatData = await updatedPatResponse.json();

    const count = updatedPatData?.data[0]?.attributes?.count;

    setUserId(id);
    setPatCount(count);
  }, [createPatData]);

    const fetchData = useCallback(async () => {
    try {
      const jwtCookie = document.cookie.replace(
        /(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      // Fetch data from /api/fun/pats regardless of whether the user is logged in
      const patsResponse = await fetch(PATS_API);
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
        const userResponse = await fetch(USER_API, {
          method: "GET",
        });
        const userData = await userResponse.json();

        if (!userData) {
          return;
        }

        // Extract user ID
        const { id } = userData;

        // Fetch pat count using user ID
        const patResponse = await fetch(`${PATS_API}/${id}`, {
          method: "GET",
        });

        const patData = await patResponse.json();

        if (patData.data && patData.data.length === 0) {
          await createPatData(id);
        }

        const updatedPatResponse = await fetch(`${PATS_API}/${id}`, {
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
      handleFetchError(error);
    }
  }, [createPatData]);

  const handleIncrement = useCallback(async () => {
    try {
      const currentPatResponse = await fetch(`${PATS_API}/${userId}`);
      const currentPatData = await currentPatResponse.json();
      const patId = currentPatData?.data[0]?.id;

      const currentCount = Number(currentPatData?.data[0]?.attributes?.count);
      const newCount = currentCount + 1;

      await fetch(`${PATS_API}/update/${patId}`, {
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
      const updatedTotalResponse = await fetch(PATS_API);
      const updatedTotalData = await updatedTotalResponse.json();
      const updatedTotalCount = updatedTotalData.data.reduce(
        (acc, pat) => acc + Number(pat.attributes.count),
        0
      );

      setTotalCount(updatedTotalCount);
      setPatCount(newCount);
    } catch (error) {
      handleFetchError(error);
    }
  }, [userId]);

  const handleFetchError = useCallback((error) => {
    console.error("Error fetching data:", error);
  }, []);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="sticky top-8 hidden w-44 shrink-0 lg:block">
          <div className="overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 border">
            <dt className="truncate text-sm font-medium">Total Count:</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">{totalCount}</dd>
          </div>
          <div className="overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 mt-6 border">
            <dt className="truncate text-sm font-medium">Dein Pat Count:</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">{patCount}</dd>
          </div>
        </aside>

        <main className="flex-1">
          <img
            src="/images/Headpat_paw_4.0.1.png"
            alt="pat"
            className="relative w-[80%] top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80 transition active:scale-75 transition-transform"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleIncrement}
          />
        </main>

        <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
          <h2>Upgrades (Bald?)</h2>
        </aside>
      </div>
    </div>
  );
}
