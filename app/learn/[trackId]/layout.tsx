import { generateMetadata } from "./generateMetadata";

export { generateMetadata };

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}