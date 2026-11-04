"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/server/supabase/server";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  next: z.string().optional(),
});

export type LoginState = { message?: string; fieldErrors?: Record<string, string[]> };

function safeNextPath(value?: string) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  if (!getPublicSupabaseConfig()) {
    return { message: "O Supabase exclusivo da RAIP ainda não foi configurado." };
  }

  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) return { message: "E-mail ou senha inválidos." };
  redirect(safeNextPath(result.data.next));
}
