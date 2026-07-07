import { Resend } from "resend";
import { envServer } from "@/lib/env/env.server";

const apiKey = envServer.RESEND_API_KEY;

if (!apiKey) throw new Error("RESEND_API_KEY não configurada.");

export const resend = new Resend(apiKey);
