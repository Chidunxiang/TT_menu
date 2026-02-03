"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, MENU, type CategoryKey } from "@/data/menu";

type CartLine = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

export default function Page() {
  const [selected, setSelected] = useState<CategoryKey>("entre");

  const baseItems = useMemo(() => MENU.filter((x) => x.category === selected), [selected]);

  // Search feature (filters within the selected category)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      // Focus the input on open
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [searchOpen]);

  const items = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return baseItems;
    return baseItems.filter((it) => {
      const hay = `${it.title} ${it.desc} ${it.badge ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [baseItems, searchQuery]);

  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [cartOpen, setCartOpen] = useState(false);

  // Comment feature (saved comment is sent on checkout)
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentSaved, setCommentSaved] = useState("");
  // Intro video splash (plays once each time the page is opened)
  const [introOpen, setIntroOpen] = useState(true);
  const [introFade, setIntroFade] = useState(false);

  function closeIntro() {
    setIntroFade(true);
    setTimeout(() => setIntroOpen(false), 300); // wait fade-out then remove
  }

  // Safety timeout: if video doesn't end (network / iOS), auto-close after 3.5s
  useEffect(() => {
    if (!introOpen) return;
    const t = setTimeout(() => closeIntro(), 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introOpen]);


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

  function openComment() {
    setCommentDraft(commentSaved);
    setCommentOpen(true);
  }

  function closeComment() {
    setCommentOpen(false); // do not save draft
    setCommentDraft(commentSaved);
  }

  function saveComment() {
    const v = commentDraft.trim();
    if (!v) return;
    setCommentSaved(v);
    setCommentOpen(false);
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
      comment: commentSaved,
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
    setCommentSaved("");
    setCommentDraft("");
    setCommentOpen(false);
    setCartOpen(false);
  }

  return (
    <div className="bg-pink-50 antialiased transition-colors duration-200">
      <div className="flex flex-col h-[100dvh] max-w-md mx-auto relative overflow-hidden bg-pink-100 shadow-2xl font-['Nunito']">
        {/* Intro Video Splash (put your video in /public/intro.mp4) */}
        {introOpen && (
          <div
            className={[
              "absolute inset-0 z-[999] flex items-center justify-center bg-black transition-opacity duration-300",
              introFade ? "opacity-0" : "opacity-100",
            ].join(" ")}
            onClick={closeIntro}
          >
            <video
              src="/intro.mp4"
              autoPlay
              playsInline
              muted
              onEnded={closeIntro}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Header固定 */}
        <header className="flex-none px-6 pt-12 pb-4 bg-pink-50 z-20 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-extrabold text-pink-400 tracking-tight">TT &</h1>

              {/* avatar (tap 5x easter egg) */}
              <div
                onClick={tapAvatar}
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-400 shadow-sm bg-pink-50 cursor-pointer"
              >
                <img src="/avatar.jpg" alt="avatar" className="w-full h-full object-cover" />
              </div>

              <h1 className="text-3xl font-extrabold text-pink-400 tracking-tight ml-1">Menu</h1>
            </div>

            <button
              onClick={() => {
                if (!searchOpen) {
                  setSearchOpen(true);
                } else {
                  // If query exists, clear it first; otherwise close
                  if (searchQuery.trim()) setSearchQuery("");
                  else setSearchOpen(false);
                }
              }}
              className="p-2 rounded-full hover:bg-pink-100 transition-colors"
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              <span className="material-icons-round text-pink-300">
                {searchOpen ? "close" : "search"}
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium pl-1">
            <span className="bg-pink-400/10 text-pink-400 px-2 py-0.5 rounded text-xs font-bold">
              大B象温馨提示
            </span>
            <span>记得按时吃饭 ❤️</span>
          </div>
          {searchOpen && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-pink-300 text-[18px]">
                  search
                </span>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="想吃啥搜搜看(中英都可以)🍗💪"
                  className="w-full rounded-2xl border border-pink-100 bg-white pl-10 pr-10 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
                {searchQuery.trim() && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-pink-50"
                    aria-label="Clear search"
                  >
                    <span className="material-icons-round text-gray-500 text-[18px]">close</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
                className="px-3 py-2 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-sm font-bold transition-colors"
              >
                Done
              </button>
            </div>
          )}
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
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-400 rounded-r-full" />
                    )}

                    <div
                      className={[
                        "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                        active ? "bg-pink-100 text-pink-400" : "bg-gray-100 group-hover:text-pink-400",
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
            {/* search bar */}
            <div className="space-y-6">
              {items.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-10">
                  没这玩意儿啊，还是想吃的菜单没有？可以comments里告诉大b象 🐘💗
                </div>
              )}
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
                      <span className="inline-flex items-baseline gap-1 text-pink-400 leading-none">
                        <span className="text-sm font-semibold opacity-60">$:</span>
                        <span className="text-[22px] font-extrabold tracking-tight">{fmtPrice(it.price)}</span>
                      </span>

                      <button
                        onClick={() => addToCart({ id: it.id, title: it.title, price: it.price })}
                        className="w-8 h-8 rounded-full bg-pink-400 text-white flex items-center justify-center shadow-lg shadow-pink-400/30 active:scale-90 transition-transform"
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
            className="relative w-14 h-14 bg-white hover:bg-pink-50 rounded-full shadow-xl flex items-center justify-center text-pink-500 hover:scale-105 transition-transform"
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
                          className="w-8 h-8 rounded-full bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 flex items-center justify-center"
                        >
                          <span className="material-icons-round text-[18px]">remove</span>
                        </button>

                        <span className="w-6 text-center font-bold">{line.qty}</span>

                        <button
                          onClick={() => addOne(line.id)}
                          className="w-8 h-8 rounded-full bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 flex items-center justify-center"
                        >
                          <span className="material-icons-round text-[18px]">add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comments panel */}
              {commentOpen && (
                <div className="mt-4 rounded-2xl border border-pink-100 bg-pink-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold text-pink-500">Comments 🐘💗</div>
                    <button
                      onClick={closeComment}
                      className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                      aria-label="Close comments"
                    >
                      <span className="material-icons-round text-gray-700">close</span>
                    </button>
                  </div>

                  <textarea
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    placeholder="写给大b象的话：做多点我太能吃了..."
                    className="mt-2 w-full min-h-[84px] resize-none rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />

                  <div className="mt-2 flex items-center justify-end">
                    <button
                      onClick={saveComment}
                      disabled={!commentDraft.trim()}
                      className={[
                        "px-4 py-2 rounded-xl text-sm font-extrabold transition-colors",
                        commentDraft.trim()
                          ? "bg-pink-500 hover:bg-pink-600 text-white"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed",
                      ].join(" ")}
                    >
                      Add comment
                    </button>
                  </div>
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
                    onClick={openComment}
                    className="px-3 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-sm font-bold transition-colors"
                  >
                    Comments
                  </button>

                  <button
                    onClick={clearCart}
                    className="px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
                  >
                    Clear
                  </button>

                  <button
                    onClick={checkout}
                    disabled={cartCount === 0}
                    className="px-4 py-2 rounded-xl bg-pink-400 hover:bg-pink-500 text-white text-sm font-extrabold disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="mt-4 w-full py-2 rounded-xl bg-pink-400 hover:bg-pink-500 text-white font-extrabold"
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