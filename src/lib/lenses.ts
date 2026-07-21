import type { Lens } from "@/types";

export interface LensMeta {
  id: Lens;
  label: string;
  short: string;
  userId: string;
  userName: string;
  initials: string;
  title: string;
}

export const LENSES: Record<Lens, LensMeta> = {
  "portfolio-manager": {
    id: "portfolio-manager",
    label: "Portfolio Manager",
    short: "Portfolio",
    userId: "usr-pm",
    userName: "Dana Whitfield",
    initials: "DW",
    title: "Portfolio Manager",
  },
  "credit-officer": {
    id: "credit-officer",
    label: "Credit & Lending Officer",
    short: "Credit",
    userId: "usr-co",
    userName: "Marcus Reyes",
    initials: "MR",
    title: "Credit & Lending Officer",
  },
  "chief-appraiser": {
    id: "chief-appraiser",
    label: "Chief Appraiser",
    short: "Appraiser",
    userId: "usr-ca",
    userName: "Priya Anand",
    initials: "PA",
    title: "Chief Appraiser",
  },
};

export const LENS_ORDER: Lens[] = ["portfolio-manager", "credit-officer", "chief-appraiser"];
