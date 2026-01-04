"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react";

/**
 * Stepper item variants
 */
const stepperItemVariants = cva(
  "group flex flex-col transition-colors rounded-lg border",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground border-muted bg-card hover:border-primary hover:bg-primary/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Stepper item header variants
 */
const stepperItemHeaderVariants = cva(
  "flex items-start justify-between gap-4 p-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Stepper item content variants
 */
const stepperItemContentVariants = cva("px-4 pb-4", {
  variants: {
    variant: {
      default: "",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

/**
 * Stepper item footer variants
 */
const stepperItemFooterVariants = cva(
  "flex items-center px-4 py-3 border-t border-border",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Stepper root props
 */
export interface StepperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof stepperItemVariants> {
  /** Whether the stepper item is open by default */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Stepper item title */
  title?: React.ReactNode;
  /** Stepper item description */
  description?: React.ReactNode;
  /** Stepper item timestamp */
  timestamp?: React.ReactNode;
  /** Stepper item status badge */
  status?: React.ReactNode;
  /** Stepper item content (shown when expanded) */
  children?: React.ReactNode;
}

/**
 * Stepper component
 *
 * A vertical stepper component with collapsible items.
 * Uses graytone colors by default and primary color on hover.
 *
 * @component
 */
function Stepper({
  className,
  variant,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  title,
  description,
  timestamp,
  status,
  children,
  ...props
}: StepperProps): React.ReactElement {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <div
      data-slot="stepper"
      className={cn(
        stepperItemVariants({ variant }),
        "flex flex-col",
        className
      )}
      {...props}
    >
      <Collapsible
        open={open}
        onOpenChange={handleOpenChange}
        className="flex flex-col flex-1"
      >
        <CollapsibleTrigger asChild>
          <div className={stepperItemHeaderVariants({ variant })}>
            <div className="flex-1 space-y-1 text-left">
              {/* Title */}
              {title && (
                <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                  {title}
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">
                  {description}
                </div>
              )}
            </div>

            {/* Expand/Collapse Icon */}
            <div className="shrink-0">
              {open ? (
                <RiArrowDownSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              ) : (
                <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        {children && (
          <CollapsibleContent
            className={cn(stepperItemContentVariants({ variant }), "flex-1")}
          >
            {children}
          </CollapsibleContent>
        )}
      </Collapsible>

      {/* Footer - Status Badge (left) and Timestamp (right) */}
      {(status || timestamp) && (
        <footer
          className={stepperItemFooterVariants({ variant })}
          data-slot="stepper-footer"
        >
          {/* Status Badge - Bottom Left */}
          {status && <div className="shrink-0">{status}</div>}

          {/* Timestamp - Bottom Right */}
          {timestamp && (
            <div className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors shrink-0 ml-auto">
              {timestamp}
            </div>
          )}
        </footer>
      )}
    </div>
  );
}

Stepper.displayName = "Stepper";

export { Stepper, stepperItemVariants };
