import * as z from "zod";

export const loginSchema = z.object({
  nik: z
    .string()
    .min(16, "NIK harus 16 digit")
    .max(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(50, "Password maksimal 50 karakter"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const API_BASE_URL =
  "https://jagajkn-be-production.up.railway.app/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    CHECK_REGISTRATION: `${API_BASE_URL}/auth/check-registration`,
  },
} as const;
