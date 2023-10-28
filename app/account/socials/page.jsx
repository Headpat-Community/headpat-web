import Layout from "@/app/layouts/account-layout";
import SocialsPage from "@/components/account/socialsPage";

export const metadata = {
  title: "Socials",
};

export default function SocialSettings() {

  return (
    <>
      <Layout>
        <SocialsPage node={SocialsPage} />
      </Layout>
    </>
  );
}
