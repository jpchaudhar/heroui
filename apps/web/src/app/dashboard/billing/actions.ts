"use server";
import axios from "axios";

export async function startCheckout(plan: "pro" | "firm") {
  const url = process.env.NEXT_PUBLIC_API_URL + "/billing/create-checkout";
  const res = await axios.post(url, { plan });
  return res.data.url as string;
}

export async function openPortal() {
  const url = process.env.NEXT_PUBLIC_API_URL + "/billing/portal";
  const res = await axios.post(url, {});
  return res.data.url as string;
}
