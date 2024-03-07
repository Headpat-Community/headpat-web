import Header from "components/account/header-server";

export default function Layout({ children }) {
  return (
    <>
      <Header>{children}</Header>
    </>
  );
}
