'use client';
import Header from "@/components/header";
import PublicGallery from "@/components/public/fetchPublicGallery";

export const runtime = "edge";

export default function Gallery() {

    return (
      <div>
        <Header />
        <PublicGallery />
      </div>
    );
  }
  