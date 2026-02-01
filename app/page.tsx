"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, MENU, type CategoryKey } from "@/data/menu";

type CartLine = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

export default function Page() {
  const [selected, setSelected] = useState<CategoryKey>("entre");

  const items = useMemo(() => MENU.filter((x) => x.category === selected), [selected]);

  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const [eggCount, setEggCount] = useState(0);
  const [showEgg, setShowEgg] = useState(false);

  function tapAvatar() {
    setEggCount((c) => {
      const next = c + 1;
      if (next >= 5) {
        setShowEgg(true);
        return 0;
      }
      return next;
    });
  }

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, line) => sum + line.qty, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => Object.values(cart).reduce((sum, line) => sum + line.qty * line.price, 0),
    [cart]
  );

  const fmtPrice = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "∞");

  function addToCart(it: { id: string; title: string; price: number }) {
    setCart((prev) => {
      const existing = prev[it.id];
      const nextQty = (existing?.qty ?? 0) + 1;
      return {
        ...prev,
        [it.id]: { id: it.id, title: it.title, price: it.price, qty: nextQty },
      };
    });
  }

  function removeOne(id: string) {
    setCart((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...existing, qty: existing.qty - 1 } };
    });
  }

  function addOne(id: string) {
    setCart((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      return { ...prev, [id]: { ...existing, qty: existing.qty + 1 } };
    });
  }

  function clearCart() {
    setCart({});
  }

  async function checkout() {
    if (cartCount === 0) return;

    const payload = {
      createdAt: new Date().toISOString(),
      category: selected,
      items: Object.values(cart).map((l) => ({
        id: l.id,
        title: l.title,
        price: l.price,
        qty: l.qty,
      })),
    };

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      alert(`Checkout failed. ${txt || ""}`.trim());
      return;
    }

    alert("大b象:稍等奥老婆，别急，马上就好!🌹");
    clearCart();
    setCartOpen(false);
  }

  return (
    <div className="bg-white antialiased transition-colors duration-200">
      <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-white shadow-2xl font-['Nunito']">
        {/* Header固定 */}
        <header className="flex-none px-6 pt-12 pb-4 bg-white z-20 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-extrabold text-sky-400 tracking-tight">TT &</h1>

              {/* avatar (tap 5x easter egg) */}
              <div
                onClick={tapAvatar}
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm bg-sky-50 cursor-pointer"
              >
                <img src="/avatar.jpg" alt="avatar" className="w-full h-full object-cover" />
              </div>

              <h1 className="text-3xl font-extrabold text-sky-400 tracking-tight ml-1">Menu</h1>
            </div>

            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <span className="material-icons-round text-gray-800">search</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium pl-1">
            <span className="bg-sky-400/10 text-sky-400 px-2 py-0.5 rounded text-xs font-bold">
              大B象温馨提示
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
                      active ? "bg-white shadow-sm" : "hover:bg-white/60 text-gray-500",
                    ].join(" ")}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-400 rounded-r-full" />
                    )}

                    <div
                      className={[
                        "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                        active ? "bg-sky-100 text-sky-400" : "bg-gray-100 group-hover:text-sky-400",
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
                          it.badge === "SPICY" ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur text-gray-800",
                        ].join(" ")}
                      >
                        {it.badge}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-1 py-1 pr-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{it.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{it.desc}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="inline-flex items-baseline gap-1 text-sky-400 leading-none">
                        <span className="text-sm font-semibold opacity-60">$:</span>
                        <span className="text-[22px] font-extrabold tracking-tight">{fmtPrice(it.price)}</span>
                      </span>

                      <button
                        onClick={() => addToCart({ id: it.id, title: it.title, price: it.price })}
                        className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-400/30 active:scale-90 transition-transform"
                      >
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

        {/* 购物车按钮固定 */}
        <div className="absolute bottom-6 right-6 z-30">
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-14 h-14 bg-white hover:bg-sky-50 rounded-full shadow-xl flex items-center justify-center text-sky-500 hover:scale-105 transition-transform"
          >
            <span className="material-icons-round">shopping_bag</span>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Cart Drawer */}
        {cartOpen && (
          <>
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/30 z-40" onClick={() => setCartOpen(false)} />

            {/* sheet */}
            <div className="absolute left-0 right-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl p-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-extrabold text-gray-900">Your Order</h3>
                <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setCartOpen(false)}>
                  <span className="material-icons-round">close</span>
                </button>
              </div>

              {cartCount === 0 ? (
                <div className="text-sm text-gray-500 py-8 text-center">赶快点餐，大b象为您服务 for infinite time 🐘</div>
              ) : (
                <div className="max-h-[45vh] overflow-y-auto no-scrollbar space-y-3">
                  {Object.values(cart).map((line) => (
                    <div key={line.id} className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 leading-tight">{line.title}</div>
                        <div className="text-xs text-gray-500">
                          <span className="inline-flex items-baseline gap-1 leading-none">
                            <span className="text-xs font-semibold opacity-60">$:</span>
                            <span className="text-sm font-semibold">{fmtPrice(line.price)}</span>
                          </span>{" "}
                          each
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeOne(line.id)}
                          className="w-8 h-8 rounded-full bg-white border border-sky-200 text-sky-600 hover:bg-sky-50 flex items-center justify-center"
                        >
                          <span className="material-icons-round text-[18px]">remove</span>
                        </button>

                        <span className="w-6 text-center font-bold">{line.qty}</span>

                        <button
                          onClick={() => addOne(line.id)}
                          className="w-8 h-8 rounded-full bg-white border border-sky-200 text-sky-600 hover:bg-sky-50 flex items-center justify-center"
                        >
                          <span className="material-icons-round text-[18px]">add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 border-t pt-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-lg font-extrabold text-gray-900 inline-flex items-baseline gap-1 leading-none">
                    <span className="text-xs font-semibold opacity-60">$:</span>
                    <span>{fmtPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
                  >
                    Clear
                  </button>

                  <button
                    onClick={checkout}
                    disabled={cartCount === 0}
                    className="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-500 text-white text-sm font-extrabold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Easter Egg Modal (tap avatar 5x) */}
        {showEgg && (
          <>
            <div className="absolute inset-0 bg-black/30 z-[60]" onClick={() => setShowEgg(false)} />
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 z-[70] bg-white rounded-2xl p-4 shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="text-lg font-extrabold text-gray-900">take you infinite time to get here huh?</div>
                <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setShowEgg(false)}>
                  <span className="material-icons-round">close</span>
                </button>
              </div>

              <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                恭喜解锁彩蛋大笨蛋<br/>
                这是给你一个人的菜单。<br/>
                想吃什么就点，I will cook it with my heart ❤️ <br/>
                Hope you will like it,<br/>
                And I hope we can have yummy dinner together for rest of our life  🍲🍛🍜🍣🍰🍩☕️<br/>
                I love you so much! 🐘💗 <br/>
                最后奖励无理由答应你一个条件吧～～
              </div>

              <button
                className="mt-4 w-full py-2 rounded-xl bg-sky-400 hover:bg-sky-500 text-white font-extrabold"
                onClick={() => setShowEgg(false)}
              >
                宝知道了
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}