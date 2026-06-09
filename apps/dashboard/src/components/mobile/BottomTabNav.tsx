"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export type BottomTabNavItem = {
  key: string;
  href: string;
  label: string;
  iconClassName: string;
  isActive?: boolean;
  badgeCount?: number;
  onClick?: () => void;
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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    
    const handleResize = () => {
      // If the window height decreases significantly (more than 150px), 
      // the keyboard is likely up
      const currentHeight = window.innerHeight;
      const isVisible = initialHeight - currentHeight > 150;
      setKeyboardVisible(isVisible);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`fixed md:hidden bottom-4 left-0 right-0 px-2 pointer-events-none transition-transform duration-300 ease-in-out ${zIndexClassName} ${
      hidden || isKeyboardVisible ? "translate-y-32" : "translate-y-0"
    }`}>
      <nav
        className={`mx-auto max-w-sm pointer-events-auto bg-white/80 backdrop-blur-md border border-white/50 py-2.5 rounded-[36px] shadow-[0_16px_48px_rgba(0,0,0,0.12)] p-1.5`}
      >
        <div className="flex items-center justify-between gap-1 relative">
          {items.map((item) => {
            const isActive = item.isActive;
            
            const content = (
              <>
                <i className={`${item.iconClassName} ${isActive ? 'text-xl text-brand-600' : 'text-xl'}`}></i>
                <span className={`text-[11px] font-semibold leading-none ${isActive ? "opacity-100 text-brand-600" : "opacity-70"}`}>
                  {item.label}
                </span>
                
                {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
                  <span className={`absolute top-1 right-2 w-4 h-4 bg-brand-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 ${isActive ? 'border-brand-50' : 'border-white'}`}>
                    {item.badgeCount > 9 ? "9+" : item.badgeCount}
                  </span>
                ) : null}
              </>
            );

            const baseClassName = `flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-all duration-400 ease-out relative rounded-[32px] ${
              isActive 
                ? "bg-brand-50 text-brand-700 shadow-sm border border-brand-100/50" 
                : "text-slate-500 hover:text-slate-900 active:scale-95"
            }`;

            if (item.onClick) {
              return (
                <button
                  key={item.key}
                  onClick={(e) => {
                    e.preventDefault();
                    item.onClick?.();
                  }}
                  className={baseClassName}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className={baseClassName}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

