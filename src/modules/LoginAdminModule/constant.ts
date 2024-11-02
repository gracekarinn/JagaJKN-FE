import * as z from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(50, "Password maksimal 50 karakter"),
});

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;

export const API_ENDPOINTS = {
  ADMIN_LOGIN:
    "https://jagajkn-be-production.up.railway.app/api/v1/auth/admin/login",
};
