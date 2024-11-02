import { Users, Building2, ArrowRightLeft } from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    id: "dashboard",
    icon: Users,
  },
  {
    label: "Faskes",
    id: "faskes",
    icon: Building2,
  },
  {
    label: "Migrasi Pengguna Lama",
    id: "migrasi",
    icon: ArrowRightLeft,
  },
];

export const API_ENDPOINTS = {
  ADMIN_LOGIN:
    "https://jagajkn-be-production.up.railway.app/api/v1/auth/admin/login",
};

export enum TingkatFaskes {
  TINGKAT_1 = "TINGKAT_1",
  TINGKAT_2 = "TINGKAT_2",
  TINGKAT_3 = "TINGKAT_3",
}

export interface Faskes {
  kodeFaskes: string;
  nama: string;
  alamat: string;
  noTelp: string;
  tingkat: TingkatFaskes;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaskesInput {
  kodeFaskes: string;
  nama: string;
  alamat: string;
  noTelp: string;
  tingkat: TingkatFaskes;
  email: string;
  password?: string;
}

export interface ApiResponse<T> {
  message: string;
  faskes?: T;
  error?: string;
  details?: string;
}
