import { Reveal } from "@/components/ui";

export const metadata = { title: "Help & FAQs" };

const SECTIONS: [string, string, [string, string][]][] = [
  ["shipping", "Shipping & packaging", [
    ["How discreet is the packaging?", "Every order ships in a plain brown box with no logos, no product names and a neutral sender name. The courier never knows what's inside."],
    ["How long does delivery take?", "Orders ship within 24 hours. Metro cities usually receive them in 2–3 business days, the rest of India in 3–5."],
    ["How much is shipping?", "Free on orders over ₹999. Below that, a flat ₹99."],
  ]],
  ["returns", "Returns & warranty", [
    ["Can I return a product?", "Unopened, factory-sealed items can be returned within 7 days of delivery. For hygiene reasons, opened intimate products can only be returned if they arrive defective."],
    ["What if my toy stops working?", "Contact us within the brand's warranty period with your order number and a short video of the issue and we'll arrange a replacement."],
  ]],
  ["privacy", "Privacy & payments", [
    ["What will my bank statement show?", "A neutral merchant name — never the word ‘toys’ or any product names."],
    ["Do you share my data?", "Never. We only use your details to deliver your order and send updates you've asked for."],
    ["Which payment methods do you accept?", "Cash or UPI on delivery today. Prepaid cards & UPI checkout are coming soon."],
  ]],
  ["safety", "Safety & care", [
    ["Are your products body-safe?", "Yes. We stock only authentic products from reputable brands made with body-safe materials such as medical-grade silicone, ABS and stainless steel."],
    ["How do I clean my toy?", "Wash with warm water and mild soap or a dedicated toy cleaner before and after use. Use water-based lube with silicone toys."],
  ]],
];

export default function Help() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-10 sm:px-8">
      <h1 className="display text-5xl sm:text-6xl">How can we <em className="text-rose">help?</em></h1>
      <div className="mt-12 space-y-12">
        {SECTIONS.map(([id, h, qs]) => (
          <section key={id} id={id} className="scroll-mt-28">
            <h2 className="display text-3xl">{h}</h2>
            <div className="mt-5 space-y-3">
              {qs.map(([q, a], i) => (
                <Reveal key={q} delay={i * 0.05}>
                  <details className="group rounded-[1.5rem] bg-white p-6 open:shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-bold">{q}<span className="text-2xl text-rose transition group-open:rotate-45">+</span></summary>
                    <p className="mt-3 text-ink/70">{a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
