import { Link } from "react-router";

import { Button } from "@/components/ui/button";

import Footer from "@/components/shared/footer";

const features = [
  {
    label: "01",
    title: "Unified Pipeline",
    desc: "Track every lead, deal, and contact in a single, distraction-free view.",
  },
  {
    label: "02",
    title: "Smart Automation",
    desc: "Let Spark handle follow-ups, reminders, and routine tasks so your team can focus.",
  },
  {
    label: "03",
    title: "Deep Insights",
    desc: "Real-time analytics that surface what matters — no spreadsheets required.",
  },
];

const stats = [
  { value: "10x", label: "faster deal closure" },
  { value: "40%", label: "less manual work" },
  { value: "99.9%", label: "uptime guaranteed" },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-playfair-display font-medium tracking-tight text-foreground select-none w-60">
            Spark
          </span>

          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <a
              href="#features"
              className="hover:text-foreground transition-colors scroll-smooth"
            >
              Features
            </a>
            <a
              href="#metrics"
              className="hover:text-foreground transition-colors scroll-smooth"
            >
              Metrics
            </a>
          </nav>

          <div className="flex items-center justify-end gap-3 w-60">
            <Button variant="ghost" size="sm" className="px-4" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" className="rounded-full px-4" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-40 pb-28 px-6 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8 font-space-mono">
            Customer Relationship Management
          </p>

          <h1 className="text-6xl md:text-7xl leading-[1.08] text-foreground mb-8 font-playfair-display">
            Relationships
            <br />
            <em className="italic text-primary">that close</em>
            <br />
            deals.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-12 font-light">
            Spark gives your team the clarity and tools to build meaningful
            customer relationships — and convert them into revenue.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              asChild
            >
              <Link to="/login">Sign in →</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      <section id="metrics" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="space-y-2 flex flex-col items-center text-center gap-2"
            >
              <p className="text-5xl text-primary font-playfair-display">
                {s.value}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-space-mono">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-16 font-space-mono">
          Core features
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {features.map((f) => (
            <div
              key={f.label}
              className="space-y-4 p-6 rounded-2xl bg-card border border-border"
            >
              <span className="text-xs text-primary font-space-mono">
                {f.label}
              </span>
              <h3 className="text-2xl text-card-foreground font-playfair-display">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-28 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl text-foreground mb-8 font-playfair-display">
          Ready to grow?
        </h2>
        <p className="text-muted-foreground font-light mb-10 max-w-sm mx-auto">
          Join teams already closing more deals with less effort.
        </p>
        <Button size="lg" className="rounded-full px-10" asChild>
          <Link to="/contact">Contact Sales</Link>
        </Button>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
