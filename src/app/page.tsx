import { HomepageModule } from "@/modules/HomepageModule";
import Image from "next/image";
import { Navbar } from "./components/navbar";
import Footer from "./components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HomepageModule />
      <Footer />
    </main>
  );
}
