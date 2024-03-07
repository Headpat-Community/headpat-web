import Client from "./page.client";

export const metadata = {
  title: "Upload",
};

export const runtime = "edge";

export default function UploadPage() {
  return (
    <>
      <Client />
    </>
  );
}
