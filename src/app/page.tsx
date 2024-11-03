import { HomepageModule } from "@/modules/HomepageModule";
import NavbarWithSuspense from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <NavbarWithSuspense />
      <HomepageModule />
      <Footer />
    </main>
  );
}
