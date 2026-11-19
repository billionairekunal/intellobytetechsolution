// Usage: node scripts/db.mjs <schema|seed|demo-reviews|clear-demo-reviews>
import { readFileSync } from "node:fs";
process.loadEnvFile(".env.local");

const ref = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
async function sql(query) {
  const r = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const body = await r.text();
  if (!r.ok) throw new Error(body);
  return JSON.parse(body);
}
const q = (s) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const arr = (a) => `array[${a.map(q).join(",")}]::text[]`;

const categories = [
  ["suction", "Air-Pulse & Suction", "Touch-free waves that feel unreal", "/e/cat-suction.webp", 1],
  ["vibrators", "Vibrators", "Rumbly, buzzy, beautifully made", "/e/cat-vibrators.webp", 2],
  ["smart", "App-Controlled", "Play together from anywhere", "/e/cat-smart.webp", 3],
  ["prostate", "Prostate Play", "Hands-free, mind-blowing", "/e/cat-prostate.webp", 4],
  ["strokers", "Strokers", "Solo sessions, upgraded", "/e/cat-strokers.webp", 5],
  ["anal", "Plugs & Anal", "Start small, go further", "/e/cat-anal.webp", 6],
  ["couples", "For Couples", "Toys made for two", "/e/cat-couples.webp", 7],
];
const blurb = {
  suction: "Instead of direct contact, gentle waves of air pulse around the most sensitive spot — a sensation people describe as unlike anything else.",
  vibrators: "Deep, resonant vibrations wrapped in body-safe silicone, designed to be held, explored and enjoyed at your own pace.",
  smart: "Pair it with the companion app to create patterns, sync to music, or hand the controls to a partner across the room — or across the world.",
  prostate: "Curved to reach the P-spot with ease, it is designed for slow build-ups and powerful, full-body release.",
  strokers: "A textured sleeve engineered for realistic sensation, easy cleaning and long-lasting comfort.",
  anal: "Tapered for comfortable insertion and finished with a flared base for safety, it is ideal for exploring at your own pace.",
  couples: "Designed to add to what you already love together — no learning curve, just more fun.",
};

const cmd = process.argv[2];
if (cmd === "schema") {
  await sql(readFileSync("supabase/schema.sql", "utf8"));
  console.log("schema applied");
} else if (cmd === "seed") {
  const products = JSON.parse(readFileSync("supabase/products.json", "utf8"));
  const cats = categories.map((c) => `(${c.slice(0, 4).map(q).join(",")},${c[4]})`).join(",");
  const rows = products.map((p) => `(${[
    q(p.slug), q(p.name), q(p.brand), q(p.category), arr(p.tags), p.price, p.mrp, q(p.badge), q(p.short),
    q(`${p.short} ${blurb[p.category]} Every order ships in plain, unbranded packaging — no logos, no product names.`),
    arr(p.features), arr(p.images), 10 + ((p.price * 7) % 40),
  ].join(",")})`).join(",\n");
  await sql(`
    insert into categories(slug,name,tagline,image,sort) values ${cats}
      on conflict (slug) do update set name=excluded.name, tagline=excluded.tagline, image=excluded.image, sort=excluded.sort;
    insert into products(slug,name,brand,category,tags,price,mrp,badge,short,description,features,images,stock) values ${rows}
      on conflict (slug) do update set name=excluded.name, brand=excluded.brand, category=excluded.category, tags=excluded.tags,
        price=excluded.price, mrp=excluded.mrp, badge=excluded.badge, short=excluded.short, description=excluded.description,
        features=excluded.features, images=excluded.images;
    insert into coupons(code, percent, min_total) values ('WELCOME10', 10, 0), ('INTELLO20', 20, 4999) on conflict do nothing;`);
  console.log(`seeded ${products.length} products`);
} else if (cmd === "demo-reviews") {
  // ponytail: demo-only reviews (user_id null) so the UI isn't empty. Remove before launch: clear-demo-reviews.
  const names = ["Aanya S.", "Rohan K.", "Meera P.", "Kabir M.", "Ishita R.", "Arjun D.", "Zoya F.", "Neel B.", "Tara J.", "Vihaan G."];
  const lines = [
    ["Beyond expectations", "Packaging was completely plain and it arrived in two days. The product itself feels premium."],
    ["Quiet and powerful", "Much quieter than I expected, and the intensity range is great. Very happy."],
    ["Great first purchase", "I was nervous ordering, but the whole experience was discreet and easy."],
    ["Worth every rupee", "Build quality is excellent and the charging lasts ages."],
    ["Lovely gift", "Bought this for my partner — we both love it."],
  ];
  const products = await sql("select id from products");
  const vals = products.flatMap((p, i) => Array.from({ length: 2 + (i % 4) }, (_, j) => {
    const [t, b] = lines[(i + j) % lines.length];
    return `('${p.id}',${q(names[(i * 3 + j) % names.length])},${j % 3 === 2 ? 4 : 5},${q(t)},${q(b)}, now() - interval '${(i + j * 7) % 60} days')`;
  }));
  await sql(`delete from reviews where user_id is null; insert into reviews(product_id,author,rating,title,body,created_at) values ${vals.join(",")};`);
  console.log(`inserted ${vals.length} demo reviews`);
} else if (cmd === "clear-demo-reviews") {
  await sql("delete from reviews where user_id is null");
  console.log("demo reviews removed");
} else console.log("usage: node scripts/db.mjs <schema|seed|demo-reviews|clear-demo-reviews>");
