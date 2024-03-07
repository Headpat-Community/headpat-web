import Client from "./page.client";

export const metadata = {
  title: "Badge",
};

export const runtime = "edge";

export default function Page() {
  return (
    <>
      <Client />
    </>
  );
}
