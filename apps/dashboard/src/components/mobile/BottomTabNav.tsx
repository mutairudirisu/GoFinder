"use client";

import Link from "next/link";

export type BottomTabNavItem = {
  key: string;
  href: string;
  label: string;
  iconClassName: string;
  isActive?: boolean;
  badgeCount?: number;
};

export function BottomTabNav({
  items,
  hidden,
  zIndexClassName = "z-50",
}: {
  items: BottomTabNavItem[];
  hidden: boolean;
  zIndexClassName?: string;
}) {
  return (
    <nav
      className={`fixed md:hidden bottom-0 left-0 right-0 ${zIndexClassName} bg-white border-t border-slate-200 transition-transform duration-200 ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="h-16 flex items-center justify-around px-2">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors relative ${
              item.isActive ? "text-brand-600" : "text-slate-500 hover:text-brand-600"
            }`}
          >
            <i className={item.iconClassName}></i>
            <span className="text-[11px] font-medium">{item.label}</span>
            {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
              <span className="absolute top-1 right-3 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.badgeCount > 9 ? "9+" : item.badgeCount}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </nav>
  );
}

