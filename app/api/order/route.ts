import { Resend } from "resend";

type IncomingItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

function fmtPrice(n: number) {
  return Number.isFinite(n) ? n.toFixed(2) : "∞";
}

export async function POST(req: Request) {
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.ORDER_NOTIFY_EMAIL;

    if (!resendKey) return new Response("Missing RESEND_API_KEY", { status: 500 });
    if (!toEmail) return new Response("Missing ORDER_NOTIFY_EMAIL", { status: 500 });

    const body = await req.json();

    const createdAt = String(body?.createdAt ?? "");
    const category = String(body?.category ?? "");
    const items: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) return new Response("Cart empty", { status: 400 });

    const lines = items
      .map((it) => `- ${it.title}  x${it.qty}   ($: ${fmtPrice(it.price)} each)`)
      .join("\n");

    const total = items.reduce((sum, it) => sum + it.qty * it.price, 0);

    const text =
      `New order ✅\n` +
      (createdAt ? `Time: ${createdAt}\n` : "") +
      (category ? `Category: ${category}\n` : "") +
      `\nItems:\n${lines}\n` +
      `\nTotal: $: ${fmtPrice(total)}\n`;

    const resend = new Resend(resendKey);

    await resend.emails.send({
      // Resend 测试阶段可以先用这个 from（如果你后面绑了自己的域名再换）
      from: "TT Menu <onboarding@resend.dev>",
      to: [toEmail],
      subject: "TT Menu — New Order ✅",
      text,
    });

    return new Response("OK", { status: 200 });
  } catch (e: any) {
    return new Response(e?.message ?? "Server error", { status: 500 });
  }
}