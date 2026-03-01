import { Helmet } from "react-helmet-async";
import { Keyboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { shortcuts } from "@/data/shortcuts";

const ShortcutsPage = () => {
  const isMac = navigator.userAgent.includes("Mac");

  const grouped = (
    shortcuts as readonly {
      keys: readonly string[];
      windowsKeys: readonly string[];
      description: string;
      context: string;
    }[]
  ).reduce<
    Record<
      string,
      {
        keys: readonly string[];
        windowsKeys: readonly string[];
        description: string;
        context: string;
      }[]
    >
  >((acc, shortcut) => {
    if (!acc[shortcut.context]) acc[shortcut.context] = [];
    acc[shortcut.context].push(shortcut);
    return acc;
  }, {});

  const totalShortcuts = shortcuts.length as number;
  const totalContexts = Object.keys(grouped).length;

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
        <div className="border-b pb-4">
          <Heading title="Keyboard Shortcuts" />
          <Description description="Boost your productivity with these keyboard shortcuts" />
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
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((shortcut, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Keyboard className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium leading-snug">
                        {shortcut.description}
                      </span>
                    </div>
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
