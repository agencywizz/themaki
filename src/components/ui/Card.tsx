import { type ReactNode } from "react";

interface CardProps {
  readonly className?: string;
  readonly children: ReactNode;
}

export default function Card({ className = "", children }: CardProps) {
  return (
    <div
      className={`bg-bg-surface rounded-xl p-4 hover:scale-[1.02] transition-transform ${className}`}
    >
      {children}
    </div>
  );
}
