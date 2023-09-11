"use client";
import FetchAccountImageTools from "../../../../components/account/gallery/fetchAccountImageTools";
import Layout from "../../../layouts/account-layout";

export const runtime = "edge";

const ImageAccountTools = () => {
  return (
    <Layout>
      <FetchAccountImageTools />
    </Layout>
  );
};

export default ImageAccountTools;
