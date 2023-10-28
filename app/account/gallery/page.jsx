"use client";
import Layout from "@/app/layouts/account-layout";
import AccountGallery from "@/components/account/gallery/accountGallery";

export const runtime = "edge";

export const metadata = {
  title: "Account Gallery",
};

export default function FetchGallery() {

  return (
    <Layout>
      <AccountGallery />
    </Layout>
  );
}
