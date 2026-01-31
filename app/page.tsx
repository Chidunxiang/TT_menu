"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, MENU, type CategoryKey } from "@/data/menu";

export default function Page() {
  const [selected, setSelected] = useState<CategoryKey>("entre");

  const items = useMemo(() => MENU.filter((x) => x.category === selected), [selected]);

  return (
    <div className="bg-white antialiased transition-colors duration-200">
      <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-white shadow-2xl font-['Nunito']">
        {/* Header固定 */}
        <header className="flex-none px-6 pt-12 pb-4 bg-white z-20 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-extrabold text-orange-500 tracking-tight">
                TT &
              </h1>
              {/* 小小象emoji */}
              <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-orange-500 shadow-sm bg-orange-50">
                <img src="/avatar.jpg" alt="avatar" className="w-full h-full object-cover" />
              </div>

              <h1 className="text-3xl font-extrabold text-orange-500 tracking-tight ml-1">
                Menu
              </h1>
            </div>

            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <span className="material-icons-round text-gray-800">search</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium pl-1">
            <span className="bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded text-xs font-bold">
              NOTICE
            </span>
            <span>记得按时吃饭 ❤️</span>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden relative">
          {/* 左侧panel固定 */}
          <aside className="w-24 flex-none bg-gray-50/60 overflow-y-auto no-scrollbar py-4 pb-20">
            <nav className="flex flex-col space-y-2 px-2">
              {CATEGORIES.map((c) => {
                const active = c.key === selected;
                return (
                  <button
                    key={c.key}
                    onClick={() => setSelected(c.key)}
                    className={[
                      "flex flex-col items-center justify-center p-3 rounded-2xl transition-all relative group",
                      active
                        ? "bg-white shadow-sm"
                        : "hover:bg-white/60 text-gray-500",
                    ].join(" ")}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                    )}

                    <div
                      className={[
                        "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                        active
                          ? "bg-orange-100 text-orange-500"
                          : "bg-gray-100 group-hover:text-orange-500",
                      ].join(" ")}
                    >
                      <span className="material-icons-round text-lg">{c.icon}</span>
                    </div>

                    <span className={active ? "text-xs font-bold text-gray-800" : "text-xs font-medium"}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* 右侧内容区域：根据分类切换 */}
          <section className="flex-1 overflow-y-auto no-scrollbar p-4 pb-24 bg-white">
            <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">
              {selected.charAt(0).toUpperCase() + selected.slice(1)} Selection
            </h2>

            <div className="space-y-6">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="group flex flex-col sm:flex-row gap-3 bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-32 w-full sm:w-32 flex-none overflow-hidden rounded-xl">
                    <img
                      alt={it.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={it.imageUrl}
                    />
                    {it.badge && (
                      <div
                        className={[
                          "absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold",
                          it.badge === "SPICY"
                            ? "bg-red-500 text-white"
                            : "bg-white/90 backdrop-blur text-gray-800",
                        ].join(" ")}
                      >
                        {it.badge}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-1 py-1 pr-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
                        {it.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{it.desc}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-extrabold text-lg text-orange-500">
                        ${it.price.toFixed(2)}
                      </span>

                      {/* 这里暂时只是UI，下一步接购物车 */}
                      <button className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-90 transition-transform">
                        <span className="material-icons-round text-sm">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-10" />
          </section>
        </main>

        {/* 购物车按钮固定（下一步接state） */}
        <div className="absolute bottom-6 right-6 z-30">
          <button className="relative w-14 h-14 bg-gray-900 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 transition-transform">
            <span className="material-icons-round">shopping_bag</span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
              0
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}