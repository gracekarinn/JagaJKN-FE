import * as z from "zod";

export const registerSchema = z.object({
  nik: z
    .string()
    .min(16, "NIK harus 16 digit")
    .max(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  namaLengkap: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  noTelp: z
    .string()
    .min(10, "No telepon minimal 10 digit")
    .max(13, "No telepon maksimal 13 digit")
    .regex(/^08\d+$/, "No telepon harus dimulai dengan 08"),
  email: z
    .string()
    .email("Format email tidak valid")
    .or(z.literal(""))
    .transform((e) => e || null),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(50, "Password maksimal 50 karakter"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const API_ENDPOINTS = {
  REGISTER: "https://jagajkn-be-production.up.railway.app/api/v1/auth/register",
};
