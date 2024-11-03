import React from "react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="flex flex-col mx-8 gap-y-8 py-12">
      <div className="flex items-center gap-x-4">
        <div className="relative w-[200px] h-[72px]">
          <Image
            alt="Health Kathon logo"
            src="/footer-jkn.png"
            fill
            sizes="none"
            className="object-contain"
          />
        </div>
      </div>
      <p className="font-bold text-gray-700">
        <span role="img" aria-label="laptop">
          💻
        </span>{" "}
        with{" "}
        <span role="img" aria-label="heart">
          ❤️
        </span>{" "}
        by pacil sehat mental
      </p>
    </footer>
  );
};

export default Footer;
