"use client";
import Layout from "../../layouts/account-layout";
import AccountGallery from "../../../components/account/gallery/accountGallery";

export const runtime = "edge";

export default function FetchGallery() {

  return (
    <Layout>
      <AccountGallery />
    </Layout>
  );
}
