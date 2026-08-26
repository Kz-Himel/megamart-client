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

// ১. ক্যাটাগরির নাম অনুযায়ী আইকন ম্যাপিং
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes("electronic") || name.includes("device") || name.includes("gadget")) {
    return <FiTv className="text-2xl" />;
  }
  if (name.includes("fashion") || name.includes("cloth") || name.includes("wear")) {
    return <FiShoppingBag className="text-2xl" />;
  }
  if (name.includes("home") || name.includes("living") || name.includes("furniture")) {
    return <FiHome className="text-2xl" />;
  }
  if (name.includes("book") || name.includes("study") || name.includes("education")) {
    return <FiBookOpen className="text-2xl" />;
  }
  if (name.includes("beauty") || name.includes("health") || name.includes("care")) {
    return <FiSmile className="text-2xl" />;
  }
  if (name.includes("tech") || name.includes("computer") || name.includes("mobile")) {
    return <FiCpu className="text-2xl" />;
  }
  if (name.includes("watch") || name.includes("accessory") || name.includes("jewel")) {
    return <FiWatch className="text-2xl" />;
  }
  if (name.includes("toy") || name.includes("gift")) {
    return <FiGift className="text-2xl" />;
  }

  // ডিফল্ট আইকন
  return <FiFolder className="text-2xl" />;
};

// ২. ব্যাকগ্রাউন্ড এবং টেক্সট থিম
const COLOR_THEMES = [
  {
    bg: "bg-purple-100/70 border-purple-200",
    hoverBg: "hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600",
    text: "text-purple-950 group-hover:text-white",
    subText: "text-purple-700/80 group-hover:text-purple-100",
    iconBox: "bg-white/80 group-hover:bg-white/20 text-purple-600 group-hover:text-white",
    arrowBox: "bg-white/80 group-hover:bg-white/20 text-purple-700 group-hover:text-white",
  },
  {
    bg: "bg-blue-100/70 border-blue-200",
    hoverBg: "hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600",
    text: "text-blue-950 group-hover:text-white",
    subText: "text-blue-700/80 group-hover:text-blue-100",
    iconBox: "bg-white/80 group-hover:bg-white/20 text-blue-600 group-hover:text-white",
    arrowBox: "bg-white/80 group-hover:bg-white/20 text-blue-700 group-hover:text-white",
  },
  {
    bg: "bg-amber-100/70 border-amber-200",
    hoverBg: "hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-600",
    text: "text-amber-950 group-hover:text-white",
    subText: "text-amber-800/80 group-hover:text-amber-100",
    iconBox: "bg-white/80 group-hover:bg-white/20 text-amber-600 group-hover:text-white",
    arrowBox: "bg-white/80 group-hover:bg-white/20 text-amber-700 group-hover:text-white",
  },
  {
    bg: "bg-emerald-100/70 border-emerald-200",
    hoverBg: "hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600",
    text: "text-emerald-950 group-hover:text-white",
    subText: "text-emerald-700/80 group-hover:text-emerald-100",
    iconBox: "bg-white/80 group-hover:bg-white/20 text-emerald-600 group-hover:text-white",
    arrowBox: "bg-white/80 group-hover:bg-white/20 text-emerald-700 group-hover:text-white",
  },
  {
    bg: "bg-rose-100/70 border-rose-200",
    hoverBg: "hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-600",
    text: "text-rose-950 group-hover:text-white",
    subText: "text-rose-700/80 group-hover:text-rose-100",
    iconBox: "bg-white/80 group-hover:bg-white/20 text-rose-600 group-hover:text-white",
    arrowBox: "bg-white/80 group-hover:bg-white/20 text-rose-700 group-hover:text-white",
  },
  {
    bg: "bg-sky-100/70 border-sky-200",
    hoverBg: "hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600",
    text: "text-sky-950 group-hover:text-white",
    subText: "text-sky-700/80 group-hover:text-sky-100",
    iconBox: "bg-white/80 group-hover:bg-white/20 text-sky-600 group-hover:text-white",
    arrowBox: "bg-white/80 group-hover:bg-white/20 text-sky-700 group-hover:text-white",
  },
];

export function CategoryCard({ category, index = 0 }: { category: any; index?: number }) {
  const productCount = category?._count?.products ?? category?.products?.length ?? 0;
  const theme = COLOR_THEMES[index % COLOR_THEMES.length];

  return (
    <Link
      href={`/products?categoryId=${category.id}`}
      className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.bg} ${theme.hoverBg}`}
    >
      <div className="flex items-center gap-4">
        {/* Dynamic Icon Container */}
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110 ${theme.iconBox}`}>
          {category.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.image}
              alt={category.name}
              className="h-8 w-8 object-contain"
            />
          ) : (
            getCategoryIcon(category.name)
          )}
        </div>

        {/* Category Info */}
        <div>
          <h3 className={`text-base font-bold transition-colors duration-300 ${theme.text}`}>
            {category.name}
          </h3>
          <p className={`mt-0.5 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-300 ${theme.subText}`}>
            <FiBox className="text-xs" />
            <span>{productCount} {productCount === 1 ? "product" : "products"}</span>
          </p>
        </div>
      </div>

      {/* Arrow Icon Box */}
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition-all duration-300 group-hover:translate-x-1 ${theme.arrowBox}`}>
        <FiArrowRight className="text-sm" />
      </div>
    </Link>
  );
}