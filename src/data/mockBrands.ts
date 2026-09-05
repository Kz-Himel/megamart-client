// Mock promotional data — there is no Brand model or Brand API in the
// backend at all, so this section can't be backed by real data yet. Kept
// separate from the component and structured so it's a drop-in swap for a
// real `GET /brands`-style endpoint later.
//
// Names are invented (Zenith/Nova/Orbit), not the reference's real brands
// (Apple/Realme/Xiaomi) — those are other companies' trademarks, and this
// promo section isn't an actual partnership with any of them.
export interface BrandPromo {
  id: string;
  name: string;
  tagline: string;
  bgClassName: string;
  fgClassName: string;
  badgeClassName: string;
  icon: "phone" | "audio" | "watch";
}

export const mockBrandPromos: BrandPromo[] = [
  {
    id: "zenith",
    name: "Zenith",
    tagline: "Up to 80% off",
    bgClassName: "bg-[#313131]",
    fgClassName: "text-white",
    badgeClassName: "bg-white text-slate-900",
    icon: "phone",
  },
  {
    id: "nova",
    name: "Nova",
    tagline: "Up to 80% off",
    bgClassName: "bg-[#FFF3CB]",
    fgClassName: "text-slate-800",
    badgeClassName: "bg-slate-900 text-white",
    icon: "audio",
  },
  {
    id: "orbit",
    name: "Orbit",
    tagline: "Up to 80% off",
    bgClassName: "bg-[#FEECE0]",
    fgClassName: "text-slate-800",
    badgeClassName: "bg-accent text-accent-foreground",
    icon: "watch",
  },
];