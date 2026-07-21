import { redirect } from "next/navigation";

// Insights is the per-lens landing (see DIRECTION-v2 §6).
export default function Home() {
  redirect("/insights");
}
