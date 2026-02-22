import { Link, Navigate } from "react-router";

import { LoadingPage } from "@/components/shared/loading";

import { quotes } from "@/data/quotes";

import { useUser } from "@/hooks/use-user";

import { LoginForm } from "./login-form";

const roleHomeMap = {
  super_admin: "/admin",
  admin: "/dashboard",
  user: "/dashboard",
} as const;

const LoginPage = () => {
  const { user, loading } = useUser();

  const quote = quotes[0];
  const year = new Date().getFullYear();

  if (loading) return <LoadingPage />;

  if (user) return <Navigate to={roleHomeMap[user.role]} replace />;

  return (
    <div className="min-h-screen grid md:grid-cols-[1fr_1fr] lg:grid-cols-[5fr_7fr] select-none">
      <div className="hidden md:flex flex-col justify-between bg-primary p-12">
        <Link
          to="/"
          className="text-2xl text-primary-foreground font-playfair-display font-medium"
        >
          Spark
        </Link>

        <div>
          <blockquote className="text-3xl font-playfair-display leading-snug text-primary-foreground/90 mb-6">
            <em>&ldquo;{quote.text}&rdquo;</em>
          </blockquote>
          <p className="text-sm font-space-mono text-primary-foreground/60">
            {quote.author}
          </p>
        </div>

        <p className="text-xs font-space-mono text-primary-foreground/40">
          &copy; {year} Spark
        </p>
      </div>

      <div className="flex flex-col justify-center items-center bg-background px-8 py-16">
        <Link
          to="/"
          className="md:hidden text-2xl text-foreground mb-12 font-playfair-display font-medium"
        >
          Spark
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-space-mono">
              Welcome back
            </p>
            <h1 className="text-4xl text-foreground font-playfair-display">
              Sign in
            </h1>
          </div>

          <LoginForm />

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
