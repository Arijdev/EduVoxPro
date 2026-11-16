import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { trackSlug: string };
}): Promise<Metadata> {
  return {
    title: "Checkout | EduVoxPro",
    description:
      "Complete your enrollment for an EduVoxPro certification track with secure UPI checkout.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/checkout/${params.trackSlug}`,
    },
  };
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}