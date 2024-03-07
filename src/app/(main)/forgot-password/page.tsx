import Client from "./page.client";

export const runtime = "edge";

export const metadata = {
  title: "Passwort vergessen?",
};

export default function Page() {
  return (
    <>
      <Client />
    </>
  );
}
