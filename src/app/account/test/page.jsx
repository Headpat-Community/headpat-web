"use client";

import { useEffect } from "react";

export default function AccountSettings() {
  useEffect(
    () => async () => {
      const getJWT = await fetch("/api/user/createJWT", {
        method: "POST",
      });

      const getJWTData = await getJWT.json();
      console.log(getJWTData);
    },
    []
  );

  return <>Test</>;
}
