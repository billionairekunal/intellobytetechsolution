import { getProducts } from "@/lib/data";
import { Quiz } from "@/components/quiz";

export const metadata = { title: "Find your match" };
export const revalidate = 300;

export default async function QuizPage() {
  return <Quiz products={await getProducts()} />;
}
