import Footer from "@/components/footer";
import NavbarWithSuspense from "@/components/navbar";
import { UserDashboardModule } from "@/modules/UserDashboardModule";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main>
        <NavbarWithSuspense />
        <UserDashboardModule />
        <Footer />
      </main>
    </Suspense>
  );
}
