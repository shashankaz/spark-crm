import "react";

declare module "react" {
  interface HTMLAttributes {
    "gs-id"?: string;
    "gs-x"?: string | number;
    "gs-y"?: string | number;
    "gs-w"?: string | number;
    "gs-h"?: string | number;
    "gs-min-w"?: string | number;
    "gs-min-h"?: string | number;
    "gs-max-w"?: string | number;
    "gs-max-h"?: string | number;
    "gs-no-resize"?: string;
    "gs-no-move"?: string;
    "gs-locked"?: string;
  }
}
