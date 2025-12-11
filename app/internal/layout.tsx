import { notFound } from "next/navigation";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only allow access if ENABLE_INTERNAL=true
  if (process.env.ENABLE_INTERNAL !== "true") {
    notFound();
  }

  return <>{children}</>;
}
