import { FiSmartphone, FiHeadphones, FiWatch } from "react-icons/fi";
import { mockBrandPromos, type BrandPromo } from "@/data/mockBrands";

const ICONS: Record<BrandPromo["icon"], React.ElementType> = {
  phone: FiSmartphone,
  audio: FiHeadphones,
  watch: FiWatch,
};

export function TopBrands() {
  return (
    <section className="w-full">
      <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
        <span className="inline-block border-b-2 border-accent pb-2">
          Top <span className="text-accent">Electronics Brands</span>
        </span>
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {mockBrandPromos.map((brand) => {
          const Icon = ICONS[brand.icon];
          return (
            <div
              key={brand.id}
              className={`relative flex h-32 items-center justify-between overflow-hidden rounded-xl p-5 ${brand.bgClassName}`}
            >
              <div>
                <span
                  className={`inline-block rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide ${brand.badgeClassName}`}
                >
                  {brand.name}
                </span>
                <p className={`mt-3 text-base font-bold sm:text-lg ${brand.fgClassName}`}>
                  {brand.tagline}
                </p>
              </div>
              <Icon className={`text-5xl opacity-25 ${brand.fgClassName}`} aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </section>
  );
}