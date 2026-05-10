/** Material Symbols with bounded box so ligature text cannot stretch layouts while fonts load. */
export function MaterialIcon({
  name,
  filled,
  className = "",
}: {
  name: string;
  filled?: boolean;
  /** Overrides default 24px box — e.g. `size-10 text-[40px]` */
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined inline-flex size-6 max-h-6 max-w-6 shrink-0 items-center justify-center overflow-hidden text-center text-[24px] leading-none ${filled ? "fill" : ""} ${className}`.trim()}
    >
      {name}
    </span>
  );
}
