export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const off = (price: number, mrp?: number | null) => (mrp && mrp > price ? Math.round((1 - price / mrp) * 100) : 0);
export const FREE_SHIP = 999;
export const SHIP_FEE = 99;
