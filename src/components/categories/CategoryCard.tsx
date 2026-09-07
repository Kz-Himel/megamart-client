import Link from "next/link";
import { 
  FiArrowRight, 
  FiBox, 
  FiFolder, 
  FiTv, 
  FiShoppingBag, 
  FiHome, 
  FiBookOpen, 
  FiSmile, 
  FiCpu, 
  FiWatch, 
  FiGift 
} from "react-icons/fi";

// ক্যাটাগরির নাম অনুযায়ী আইকন ম্যাপিং
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes("electronic") || name.includes("device") || name.includes("gadget")) {
    return <FiTv className="text-xl" />;
  }
  if (name.includes("fashion") || name.includes("cloth") || name.includes("wear")) {
    return <FiShoppingBag className="text-xl" />;
  }
  if (name.includes("home") || name.includes("living") || name.includes("furniture")) {
    return <FiHome className="text-xl" />;
  }
  if (name.includes("book") || name.includes("study") || name.includes("education")) {
    return <FiBookOpen className="text-xl" />;
  }
  if (name.includes("beauty") || name.includes("health") || name.includes("care")) {
    return <FiSmile className="text-xl" />;
  }
  if (name.includes("tech") || name.includes("computer") || name.includes("mobile")) {
    return <FiCpu className="text-xl" />;
  }
  if (name.includes("watch") || name.includes("accessory") || name.includes("jewel")) {
    return <FiWatch className="text-xl" />;
  }
  if (name.includes("toy") || name.includes("gift")) {
    return <FiGift className="text-xl" />;
  }

  return <FiFolder className="text-xl" />;
};

export function CategoryCard({ category }: { category: any }) {
  const productCount = category?._count?.products ?? category?.products?.length ?? 0;

  return (
    <Link
      href={`/products?categoryId=${category.id}`}
      className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
    >
      <div className="flex items-center gap-3.5">
        {/* MegaMart Icon/Image Container */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white">
          {category.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.image}
              alt={category.name}
              className="h-7 w-7 object-contain"
            />
          ) : (
            getCategoryIcon(category.name)
          )}
        </div>

        {/* Category Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 transition-colors duration-200 group-hover:text-sky-600">
            {category.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <FiBox className="text-[11px]" />
            <span>{productCount} {productCount === 1 ? "product" : "products"}</span>
          </p>
        </div>
      </div>

      {/* Arrow Indicator */}
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-sky-50 group-hover:text-sky-600 group-hover:translate-x-1">
        <FiArrowRight className="text-xs" />
      </div>
    </Link>
  );
}