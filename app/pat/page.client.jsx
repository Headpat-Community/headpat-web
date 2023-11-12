"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { createPatData } from "./page.api";

const PATS_API = "/api/fun/pats";
const USER_API = "/api/user/getUserSelf";

export default function PatClient() {
  const [userId, setUserId] = useState(null);
  const [patCount, setPatCount] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const jwtCookie = document.cookie.replace(
        /(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const headers = {
        Authorization: `Bearer ${jwtCookie}`,
      };

      // Fetch total count directly from the server
      const totalResponse = await fetch(PATS_API, { headers });
      const totalData = await totalResponse.json();
      const totalCount = totalData.data.reduce(
        (acc, pat) => acc + Number(pat.attributes.count),
        0
      );
      setTotalCount(totalCount);

      if (jwtCookie) {
        // Fetch user-specific data directly from the server
        const userResponse = await fetch(USER_API, { headers });
        const userData = await userResponse.json();

        if (!userData) {
          return;
        }

        const { id } = userData;

        // Fetch pat count using user ID directly from the server
        const patResponse = await fetch(`${PATS_API}/${id}`, { headers });
        const patData = await patResponse.json();

        if (patData.data && patData.data.length === 0) {
          await createPatData(id);
        }

        const count = patData?.data[0]?.attributes?.count;
        setUserId(id);
        setPatCount(count);
      }
    } catch (error) {
      handleFetchError(error);
    }
  }, [createPatData]);

  const handleIncrement = useCallback(async () => {
    try {
      const jwtCookie = document.cookie.replace(
        /(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const headers = {
        Authorization: `Bearer ${jwtCookie}`,
        "Content-Type": "application/json",
      };

      // Fetch current pat count directly from the server
      const currentPatResponse = await fetch(`${PATS_API}/${userId}`, {
        headers,
      });
      const currentPatData = await currentPatResponse.json();
      const patId = currentPatData?.data[0]?.id;

      const currentCount = Number(currentPatData?.data[0]?.attributes?.count);
      const newCount = currentCount + 1;

      // Update the pat count directly on the server
      await fetch(`${PATS_API}/update/${patId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          data: {
            count: newCount,
          },
        }),
      });

      // Fetch the total count directly from the server and update the state
      const updatedTotalResponse = await fetch(PATS_API, { headers });
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
            <dd className="mt-1 text-3xl font-semibold tracking-tight">
              {totalCount}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 mt-6 border">
            <dt className="truncate text-sm font-medium">Dein Pat Count:</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">
              {patCount}
            </dd>
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
