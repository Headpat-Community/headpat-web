import Layout from "@/app/layouts/account-layout";
import Upload from "@/components/account/upload";

export const metadata = {
  title: "Upload",
};

export default function UploadPage() {
  return (
    <>
      <Layout>
        <Upload />
      </Layout>
    </>
  );
}
