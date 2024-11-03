import Footer from "@/components/footer";
import NavbarWithSuspense from "@/components/navbar";
import { UserDashboardModule } from "@/modules/UserDashboardModule";
import React from "react";

const page = () => {
  return (
    <main>
      <NavbarWithSuspense />
      <UserDashboardModule />

      <Footer />
    </main>
  );
};

export default page;
