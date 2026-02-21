import { Link } from "react-router";

import { Footer } from "@/components/shared/footer";

export const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link
            to="/"
            className="text-xl font-playfair-display font-medium tracking-tight text-foreground select-none"
          >
            Spark
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-10 h-10 rounded-full border-2 border-border border-t-foreground animate-spin" />

        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-space-mono">
          Loading
        </p>
      </main>

      <Footer />
    </div>
  );
};
