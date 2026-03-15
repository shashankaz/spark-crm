import { Helmet } from "react-helmet-async";

import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { getShortcutsForRole } from "@/data/shortcuts";

import { useUser } from "@/hooks/use-user";

const ShortcutsPage = () => {
  const isMac = navigator.userAgent.includes("Mac");

  const { user } = useUser();

  const role = user?.role ?? "user";
  const visibleShortcuts = getShortcutsForRole(role);

  const grouped = visibleShortcuts.reduce<
    Record<string, typeof visibleShortcuts>
  >((acc, shortcut) => {
    if (!acc[shortcut.context]) acc[shortcut.context] = [];
    acc[shortcut.context].push(shortcut);
    return acc;
  }, {});

  const totalShortcuts = visibleShortcuts.length;
  const totalContexts = Object.keys(grouped).length;

  const roleLabel =
    role === "super_admin"
      ? "Super Admin"
      : role === "admin"
        ? "Admin"
        : "User";

  return (
    <>
      <Helmet>
        <title>Keyboard Shortcuts | Dashboard</title>
        <meta
          name="description"
          content="Keyboard shortcuts for the application"
        />
      </Helmet>

      <div className="space-y-6">
        <div className="border-b pb-4 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Heading title="Keyboard Shortcuts" />
            <Description description="Boost your productivity with these keyboard shortcuts" />
          </div>
          <Badge
            variant="outline"
            className="text-xs font-semibold px-3 py-1.5 shrink-0"
          >
            {roleLabel} shortcuts
          </Badge>
        </div>

        <div className="space-y-8">
          {Object.entries(grouped).map(([context, items]) => (
            <div key={context} className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="text-xs font-semibold px-3 py-1"
                >
                  {context}
                </Badge>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground shrink-0">
                  {items.length} shortcut{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((shortcut, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium leading-snug min-w-0">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1 ml-3 shrink-0">
                      {(isMac ? shortcut.keys : shortcut.windowsKeys).map(
                        (k, j) => (
                          <kbd
                            key={j}
                            className="pointer-events-none inline-flex h-7 min-w-7 items-center justify-center rounded border bg-muted px-2 font-sans text-xs font-medium text-muted-foreground"
                          >
                            {k}
                          </kbd>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            {totalShortcuts} shortcut{totalShortcuts !== 1 ? "s" : ""} across{" "}
            {totalContexts} context{totalContexts !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
};

export default ShortcutsPage;
