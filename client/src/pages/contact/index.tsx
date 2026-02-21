import { Link } from "react-router";

import { Button } from "@/components/ui/button";

import { Footer } from "@/components/shared/footer";

import { ContactForm } from "./contact-form";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter flex flex-col">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-playfair-display font-medium tracking-tight text-foreground select-none"
          >
            Spark
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="px-4" asChild>
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="md:pt-4">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6 font-space-mono">
              Get in touch
            </p>
            <h1 className="text-5xl md:text-6xl font-playfair-display text-foreground leading-[1.08] mb-6">
              Let&apos;s start a{" "}
              <em className="italic text-primary">conversation.</em>
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-sm">
              Tell us about your team and what you&apos;re trying to achieve.
              We&apos;ll get back to you within one business day.
            </p>

            <div className="mt-12 space-y-6">
              {[
                { label: "Email", value: "hello@spark.io" },
                { label: "Office", value: "Mumbai, India" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-space-mono mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
