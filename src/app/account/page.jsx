import Layout from "@/app/layouts/account-layout";
import Client from "./page.client";

export const metadata = {
  title: "Account Settings",
};

export default function AccountSettings() {
  return (
    <>
      <Layout>
        <Client />
      </Layout>
    </>
  );
}
