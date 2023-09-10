'use client';
import Footer from "../../components/footer";
import Header from "../../components/header";
import PublicGallery from "../../components/public/fetchPublicGallery";

export default function Gallery() {

    return (
      <div>
        <Header />
        <PublicGallery />
        <Footer />
      </div>
    );
  }
  