'use client';
import Header from "@/components/header";
import PublicGallerySingle from "@/components/public/fetchGallerySingle";

export const runtime = "edge";

export default function Gallery() {

    return (
      <div>
        <Header />
        <PublicGallerySingle />
      </div>
    );
  }
  