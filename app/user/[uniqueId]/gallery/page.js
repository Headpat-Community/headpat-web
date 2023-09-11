"use client";
import Header from "../../../../components/header";
import Footer from "../../../../components/footer";
import UserGalleryPage from "../../../../components/user/galleryPage";

export const runtime = "edge";

export default function FetchGallery() {
  return (
    <>
      <Header />
      <UserGalleryPage />
      <Footer />
    </>
  );
}
