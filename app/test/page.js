'use client';
import Head from "next/head";
import { useState } from "react";
import Gallery from "@/components/ImageDetail";
export default function Home({ stuff }) {
  const [photos, setPhotos] = useState(stuff);
  const [search, setSearch] = useState("");
  return (
    <div>
      <Head>
        <title>Photo Gallery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <div>
            {photos &&
              photos.data.map((detail) => (
                <Gallery
                  key={detail.id}
                  thumbnailUrl={detail.attributes.img.data.attributes.formats.thumbnail.url}
                  title={detail.attributes.name}
                  id={detail.id}
                />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
export async function getStaticProps() {
  const results = await fetch("https://backend.headpat.de/api/gallery?populate=*");
  const stuff = await results.json();
  return {
    props: { stuff },
  };
}