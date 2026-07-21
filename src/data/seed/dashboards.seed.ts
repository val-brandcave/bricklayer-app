import type { Dashboard } from "@/types";

const T = 1_767_225_600_000;

/* Default dashboard per lens (star-set), plus favorites and an ephemeral one.
   Tiles are laid out on a 12-column grid; h is row-span units. */
export const seedDashboards: Dashboard[] = [
  {
    id: "dash-pm-default", name: "Portfolio Overview", description: "Book-wide health for the portfolio manager.",
    lens: "portfolio-manager", ownerId: "usr-pm", ownerName: "Dana Whitfield", access: "everyone-view",
    isDefault: true, favorite: true, ephemeral: false, origin: "user", createdAt: T,
    tiles: [
      { reportId: "rep-book-kpi", x: 0, y: 0, w: 3, h: 2 },
      { reportId: "rep-caprate-gauge", x: 3, y: 0, w: 3, h: 2 },
      { reportId: "rep-book-trend", x: 6, y: 0, w: 6, h: 2 },
      { reportId: "rep-value-by-class", x: 0, y: 2, w: 6, h: 3 },
      { reportId: "rep-distribution", x: 6, y: 2, w: 6, h: 3 },
      { reportId: "rep-correlation", x: 0, y: 5, w: 6, h: 3 },
      { reportId: "rep-watchlist", x: 6, y: 5, w: 6, h: 3 },
    ],
  },
  {
    id: "dash-co-default", name: "Credit Risk Board", description: "Reprice and refresh risk for lending decisions.",
    lens: "credit-officer", ownerId: "usr-co", ownerName: "Marcus Reyes", access: "everyone-view",
    isDefault: true, favorite: true, ephemeral: false, origin: "user", createdAt: T,
    tiles: [
      { reportId: "rep-staleness", x: 0, y: 0, w: 6, h: 3 },
      { reportId: "rep-watchlist", x: 6, y: 0, w: 6, h: 3 },
      { reportId: "rep-value-vs-cap", x: 0, y: 3, w: 6, h: 3 },
      { reportId: "rep-flood", x: 6, y: 3, w: 6, h: 3 },
      { reportId: "rep-reprice", x: 0, y: 6, w: 12, h: 3 },
    ],
  },
  {
    id: "dash-ca-default", name: "Appraisal Quality", description: "Workload, methodology, and data-health for the chief appraiser.",
    lens: "chief-appraiser", ownerId: "usr-ca", ownerName: "Priya Anand", access: "everyone-view",
    isDefault: true, favorite: true, ephemeral: false, origin: "user", createdAt: T,
    tiles: [
      { reportId: "rep-workload", x: 0, y: 0, w: 6, h: 3 },
      { reportId: "rep-extraction", x: 6, y: 0, w: 3, h: 3 },
      { reportId: "rep-approach-mix", x: 9, y: 0, w: 3, h: 3 },
      { reportId: "rep-appraisal-table", x: 0, y: 3, w: 12, h: 3 },
    ],
  },
  {
    id: "dash-pm-concentration", name: "Concentration & Cap-Rate Risk", description: "AI-assembled from a chat prompt.",
    lens: "portfolio-manager", ownerId: "usr-pm", ownerName: "Dana Whitfield", access: "private",
    isDefault: false, favorite: false, ephemeral: false, origin: "ai", createdAt: T,
    tiles: [
      { reportId: "rep-value-by-class", x: 0, y: 0, w: 6, h: 3 },
      { reportId: "rep-cap-by-vintage", x: 6, y: 0, w: 6, h: 3 },
      { reportId: "rep-class-pie", x: 0, y: 3, w: 4, h: 3 },
      { reportId: "rep-psf-by-class", x: 4, y: 3, w: 8, h: 3 },
    ],
  },
  {
    id: "dash-co-committee", name: "Q2 Credit Committee", description: "Ephemeral — built for the 22 Jul meeting.",
    lens: "credit-officer", ownerId: "usr-co", ownerName: "Marcus Reyes", access: "private",
    isDefault: false, favorite: false, ephemeral: true, origin: "user", createdAt: T,
    tiles: [
      { reportId: "rep-watchlist", x: 0, y: 0, w: 6, h: 3 },
      { reportId: "rep-staleness", x: 6, y: 0, w: 6, h: 3 },
      { reportId: "rep-reprice", x: 0, y: 3, w: 12, h: 3 },
    ],
  },
];
