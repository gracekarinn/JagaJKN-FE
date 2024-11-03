import Footer from "@/components/footer";
import NavbarWithSuspense from "@/components/navbar";
import { HomepageModule } from "@/modules/HomepageModule";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main>
        <NavbarWithSuspense />
        <HomepageModule />
        <Footer />
      </main>
    </Suspense>
  );
}
