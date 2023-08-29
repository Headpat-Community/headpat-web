import Link from "next/link";

export default function Home() {

  return (
    <div>
      <h1>Hi c:</h1>
      <span>Coming soon! :3</span><br /><br />

      <span>links:</span><br /><br />
      <Link href="/login">Login</Link><br />
      <Link href="/register">Register</Link><br />
      <Link href="/user/testy">Account test page</Link><br />
      <Link href="/user/veve/gallery">Gallerie seite</Link><br />
      <Link href="/gallery">Offenbare gallerie</Link><br />
    </div>
  );
}
