import Layout from "@/app/layouts/account-layout";
import BadgePage from "@/components/account/badgePage";

export const metadata = {
  title: "Badge request",
};

export default function AccountBadgePage() {
  return (
    <>
      <Layout>
        <BadgePage />
      </Layout>
    </>
  );
}
