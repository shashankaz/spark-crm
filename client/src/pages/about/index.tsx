import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/footer";

const values = [
  {
    label: "01",
    title: "Keep It Simple",
    desc: "We strip away everything that doesn't serve the user. If a feature adds confusion, it doesn't ship.",
  },
  {
    label: "02",
    title: "Build in the Open",
    desc: "We share what we're working on, why we made certain calls, and where we're headed next.",
  },
  {
    label: "03",
    title: "Ship and Learn",
    desc: "We'd rather put something real in your hands and improve it than wait for perfection in private.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter flex flex-col select-none">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-playfair-display font-medium tracking-tight text-foreground w-60"
          >
            Spark
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <a
              href="#mission"
              className="hover:text-foreground transition-colors"
            >
              Mission
            </a>
            <a
              href="#values"
              className="hover:text-foreground transition-colors"
            >
              Values
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

      <main className="flex-1">
        <section className="pt-40 pb-28 px-6 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8 font-space-mono">
              Our story
            </p>
            <h1 className="text-6xl md:text-7xl leading-[1.08] text-foreground mb-8 font-playfair-display">
              A CRM you&apos;ll
              <br />
              <em className="italic text-primary">actually use.</em>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md font-light">
              Spark is just getting started. We set out to build a CRM that
              feels lightweight from day one — no onboarding marathons, no
              feature graveyards, just the tools your team needs right now.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-border" />
        </div>

        <section id="mission" className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6 font-space-mono">
              Why we exist
            </p>
            <h2 className="text-4xl md:text-5xl font-playfair-display text-foreground leading-[1.1] mb-6">
              Sales tools should
              <br />
              <em className="italic text-primary">work for you.</em>
            </h2>
          </div>
          <div className="md:pt-14 space-y-5 text-muted-foreground font-light leading-relaxed text-base">
            <p>
              Most CRMs are built to impress buyers in a demo, not to help
              sellers do their job. The result is software that&apos;s powerful
              on paper but painful in practice.
            </p>
            <p>
              We started Spark to flip that. Every screen, every interaction is
              designed around one question: does this help a salesperson close
              the next deal faster?
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-border" />
        </div>

        <section id="values" className="py-24 px-6 max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-16 font-space-mono">
            How we work
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {values.map((v) => (
              <div
                key={v.label}
                className="space-y-4 p-6 rounded-2xl bg-card border border-border"
              >
                <span className="text-xs text-primary font-space-mono">
                  {v.label}
                </span>
                <h3 className="text-2xl text-card-foreground font-playfair-display">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-border" />
        </div>

        <section className="py-28 px-6 max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl text-foreground mb-8 font-playfair-display">
            Shape what Spark
            <br />
            <em className="italic text-primary">becomes.</em>
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-sm mx-auto">
            We&apos;re in early days and every piece of feedback makes a real
            difference. Reach out — we read everything.
          </p>
          <Button size="lg" className="rounded-full px-10" asChild>
            <Link to="/contact">Get in touch</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
