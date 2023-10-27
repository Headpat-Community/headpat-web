import Footer from "@/components/footer";
import Header from "@/components/header";
import PublicGallery from "@/components/public/fetchPublicGallery";

export const metadata = {
  title: "Gallerie",
  description: "Die Gallerie seite von Headpat Community. Hier könnt ihr alle Bilder sehen die von der Community hochgeladen wurden.",
};

export default function Gallery() {
    return (
      <div>
        <Header />
        <PublicGallery />
        <Footer />
      </div>
    );
  }
  