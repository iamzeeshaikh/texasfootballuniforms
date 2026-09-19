import type { Metadata } from "next";

import { OrderConfirmation } from "@/components/order-confirmation";

export const metadata: Metadata = {
  title: "Order placed — Texas Football Uniforms",
  description:
    "Your custom football uniform order is with our team. Free mockup in 24 hours, production 1 to 2 weeks after approval, free shipping, and payment by cash on delivery or a PayPal invoice we email after you approve the proof.",
  robots: { index: false, follow: true },
};

export default function OrderConfirmedPage() {
  return (
    <section className="py-16">
      <OrderConfirmation />
    </section>
  );
}
