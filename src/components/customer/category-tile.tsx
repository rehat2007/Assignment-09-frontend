import type { ServiceCategory } from "@/lib/services";
import { CATEGORY_ICONS, CATEGORY_TONES, TONES } from "@/lib/service-styles";

export function CategoryTile({
  category,
  small = false,
}: {
  category: ServiceCategory;
  small?: boolean;
}) {
  const Icon = CATEGORY_ICONS[category];
  const tone = TONES[CATEGORY_TONES[category]];

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[10px] border ${
        small ? "size-9" : "size-10"
      } ${tone.tile}`}
    >
      <Icon className={small ? "size-4" : "size-[18px]"} strokeWidth={1.8} />
    </span>
  );
}
