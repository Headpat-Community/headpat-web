"use client";
import FetchAccountImageTools from "@/components/account/gallery/fetchAccountImageTools";
import Layout from "@/app/layouts/account-layout";

export const runtime = "edge";

export const metadata = {
  title: "Account Gallery",
};

const ImageAccountTools = () => {
  return (
    <Layout>
      <FetchAccountImageTools />
    </Layout>
  );
};

export default ImageAccountTools;
