import { Link } from "react-router";

import { Button } from "@/components/ui/button";

import { Footer } from "@/components/shared/footer";

const NotFound = () => {
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

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6 font-space-mono">
          Error 404
        </p>

        <h1 className="text-7xl md:text-8xl font-playfair-display text-foreground mb-4 leading-none">
          Not <em className="italic text-primary">found.</em>
        </h1>

        <p className="text-lg text-muted-foreground font-light max-w-sm mt-6 mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8"
            asChild
          >
            <Link to="/contact">Contact us →</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
