import React from "react";
import Image from "next/image";
import { HOMEPAGE_DATA } from "../constant";

export const HomepageSection = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[95px]">
      <div className="flex items-center justify-center gap-[120px]">
        <div className="flex-1 max-w-sm">
          <p className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
            <span className="text-[#1E4583]">Jaga</span>
            <span className="text-[#04A04A]">JKN</span>, Jaga Data Pribadi Anda!
          </p>
          <p className="text-gray-600 text-lg">
            JagaJKN, sistem perekaman medis yang terintegrasi dengan Mobile JKN,
            tidak hanya menyederhanakan proses pendaftaran JKN Mobile, tetapi
            juga menyimpan semua data pengguna dan rekam medis secara aman di
            blockchain, memastikan <span className="font-bold">keamanan</span>{" "}
            informasi kesehatan Anda.
          </p>
        </div>
        <div className="relative w-[377px] h-[423px]">
          <Image
            alt="contoh"
            src="/bpjss.png"
            fill
            sizes="none"
            className="object-contain"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-[87px]">
        {HOMEPAGE_DATA.map((item, index) => (
          <div
            key={index}
            className="bg-[#F5F5FF] rounded-[20px] p-6 shadow-[0px_0px_50px_0px_#FFF,25px_25px_50px_0px_rgba(0,0,0,0.10)] transition-shadow hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
          >
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              {item.title}
            </h2>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
};
