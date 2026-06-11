import type { Metadata } from "next";
import CartPage from "./CartPage";

export const metadata: Metadata = {
  title: "Upit za iznajmljivanje",
  description: "Pregledajte svoju košaricu i pošaljite upit za iznajmljivanje opreme.",
  robots: { index: false },
};

export default function UpitPage() {
  return <CartPage />;
}
