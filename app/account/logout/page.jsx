"use client";
import { useEffect } from "react";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default function LogoutPage() {
  useEffect(() => {
    const jwt = getCookie("jwt");
    if (!jwt || typeof jwt === "undefined") {
      window.location.href = "/";
    } else {
      deleteCookie("jwt");
      window.location.href = "/";
    }
  }, []);
}
