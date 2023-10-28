import Layout from "@/app/layouts/account-layout";
import AccountPage from "@/components/account/accountPage";

export const metadata = {
  title: "Account Settings",
};

export default function AccountSettings() {
  return (
    <>
      <Layout>
        <AccountPage />
      </Layout>
    </>
  );
}
