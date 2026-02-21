const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm text-primary font-playfair-display">
          Spark
        </span>
        <p className="text-xs text-muted-foreground font-space-mono">
          &copy; {year} Spark. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
