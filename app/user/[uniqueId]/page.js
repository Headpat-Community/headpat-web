"use client";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);

  const username = window.location.pathname.split("/")[2];

  useEffect(() => {
    fetch(
      `https://backend.headpat.de/api/users?filters[username][$eq]=${username}`
    )
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, [username]);

  return (
    <div>
      {userData ? (
        <div>
          <h1>{userData[0].bio}</h1>
          <p>{userData[0].status}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
