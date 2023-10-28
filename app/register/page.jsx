import Header from "@/components/header";
import Register from "@/components/register";

export const metadata = {
  title: "Registration",
  description: "Hier kannst du dich registrieren für die Headpat Community",
  url: "https://headpat.de/register",
  keywords: "register, account, sign up, registrieren",
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <Register />
    </>
  );
}
