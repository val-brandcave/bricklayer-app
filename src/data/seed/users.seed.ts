import type { User } from "@/types";

const T = 1_767_225_600_000; // 2026-01-01

export const seedUsers: User[] = [
  {
    id: "usr-pm",
    name: "Dana Whitfield",
    email: "dana.whitfield@meridiantrust.bank",
    title: "Portfolio Manager",
    lens: "portfolio-manager",
    initials: "DW",
    createdAt: T,
  },
  {
    id: "usr-co",
    name: "Marcus Reyes",
    email: "marcus.reyes@meridiantrust.bank",
    title: "Credit & Lending Officer",
    lens: "credit-officer",
    initials: "MR",
    createdAt: T,
  },
  {
    id: "usr-ca",
    name: "Priya Anand",
    email: "priya.anand@meridiantrust.bank",
    title: "Chief Appraiser",
    lens: "chief-appraiser",
    initials: "PA",
    createdAt: T,
  },
];
