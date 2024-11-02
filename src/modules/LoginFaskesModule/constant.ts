import * as z from "zod";

export const faskesLoginSchema = z.object({
  kodeFaskes: z.string().min(1, "Kode Faskes wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type FaskesLoginSchema = z.infer<typeof faskesLoginSchema>;

export interface FaskesLoginResponse {
  token: string;
  faskes: {
    kodeFaskes: string;
    namaFaskes: string;
  };
}

export const API_ENDPOINTS = {
  FASKES_LOGIN:
    "https://jagajkn-be-production.up.railway.app/api/v1/auth/faskes/login",
};
