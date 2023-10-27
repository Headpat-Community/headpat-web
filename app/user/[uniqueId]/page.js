"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UserPage from "@/components/user/userPage";

export const runtime = "edge";

export default function UserProfile() {
  return (
    <>
      <Header />
      <UserPage />
      <Footer />
    </>
  );
}
