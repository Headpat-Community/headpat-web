import Client from "./page.client";

export const metadata = {
  title: "ID Card",
};

export const runtime = "edge";

export default function Page() {
  return (
    <>
      <Client />
    </>
  );
}
