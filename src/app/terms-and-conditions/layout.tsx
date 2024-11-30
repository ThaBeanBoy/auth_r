import type { ReactNode } from "react";

export default function TermsAndConditionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="prose mx-auto mt-4 max-w-screen-md">{children}</div>;
}
