import { CategoryTile } from "@/components/customer/category-tile";
import type { ServiceCategory } from "@/lib/services";

export function ServiceThumbnail({
  image,
  category,
  small = false,
  className = "",
}: {
  image?: string | null;
  category: ServiceCategory;
  small?: boolean;
  className?: string;
}) {
  if (!image) {
    return <CategoryTile category={category} small={small} />;
  }

  return (
    <span
      role="img"
      aria-label={`${category} service`}
      className={`shrink-0 rounded-[10px] border border-black/[0.06] bg-cover bg-center dark:border-white/10 ${
        small ? "size-9" : "size-10"
      } ${className}`}
      style={{ backgroundImage: `url(${image})` }}
    />
  );
}
