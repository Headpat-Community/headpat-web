"use client";
import dynamic from 'next/dynamic'
import Layout from "@/app/layouts/account-layout";

const SocialsPage = dynamic(() => import('@/components/account/socialsPage'), {
  ssr: false,
})

export default function SocialSettings() {

  return (
    <>
      <Layout>
        <SocialsPage node={SocialsPage} />
      </Layout>
    </>
  );
}
