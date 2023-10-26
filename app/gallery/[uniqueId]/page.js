import Header from "../../../components/header";
import PublicGallerySingle from "../../../components/public/fetchGallerySingle";

export const runtime = "edge";

export const metadata = {
  title: "Gallery",
  description: "Die Gallerie seite von Headpat Community. Hier könnt ihr alle Bilder sehen die von der Community hochgeladen wurden.",
};

export default function Gallery() {
  return (
    <div>
      <Header />
      <PublicGallerySingle />
    </div>
  );
}
