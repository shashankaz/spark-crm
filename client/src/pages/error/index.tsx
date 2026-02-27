import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/footer";

interface ErrorPageProps {
  error?: Error | null;
  reset?: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <a
            href="/"
            className="text-xl font-playfair-display font-medium tracking-tight text-foreground select-none"
          >
            Spark
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6 font-space-mono">
          Error 500
        </p>

        <h1 className="text-7xl md:text-8xl font-playfair-display text-foreground mb-4 leading-none">
          Something <em className="italic text-primary">broke.</em>
        </h1>

        <p className="text-lg text-muted-foreground font-light max-w-sm mt-6 mb-4 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
        </p>

        {error?.message && (
          <p className="text-sm text-muted-foreground font-space-mono bg-muted px-4 py-2 rounded-md mb-6 max-w-md truncate">
            {error.message}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          {reset && (
            <Button size="lg" className="rounded-full px-8" onClick={reset}>
              Try again
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8"
            asChild
          >
            <a href="/">Go home</a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8"
            asChild
          >
            <a href="/contact">Contact us →</a>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ErrorPage;
