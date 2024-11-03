import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { UserDashboardModule } from "@/modules/UserDashboardModule";
import React from "react";

const page = () => {
  return (
    <main>
      <Navbar />
      <UserDashboardModule />
      <Footer />
    </main>
  );
};

export default page;
