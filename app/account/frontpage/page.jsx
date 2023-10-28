"use client";
import Layout from "@/app/layouts/account-layout";
import FrontPage from "@/components/account/frontPage";

export const metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <>
      <Layout>
        <FrontPage />
      </Layout>
    </>
  );
}
