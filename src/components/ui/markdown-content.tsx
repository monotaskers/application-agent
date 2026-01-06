/**
 * @fileoverview Reusable Markdown content renderer component
 * @module components/ui/markdown-content
 */

"use client";

import type { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

/**
 * Props for the MarkdownContent component
 */
interface MarkdownContentProps {
  /** Markdown content to render */
  content: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Renders Markdown content with consistent styling.
 *
 * Uses react-markdown for parsing and applies prose-like styling
 * for headings, lists, paragraphs, and links.
 *
 * @param props - Component props
 * @returns Rendered markdown content
 *
 * @example
 * ```tsx
 * <MarkdownContent content="## Heading\n\nSome **bold** text." />
 * ```
 */
export function MarkdownContent({
  content,
  className,
}: MarkdownContentProps): ReactElement {
  return (
    <div
      className={cn(
        // Base typography
        "text-sm leading-relaxed text-foreground",
        // Headings
        "[&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-xl [&_h1]:font-semibold",
        "[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold",
        "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-medium",
        "[&_h4]:mb-2 [&_h4]:mt-3 [&_h4]:text-sm [&_h4]:font-medium",
        // Paragraphs
        "[&_p]:mb-3 [&_p]:last:mb-0",
        // Lists
        "[&_ul]:mb-3 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1",
        "[&_ol]:mb-3 [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1",
        "[&_li]:pl-1",
        // Links
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80",
        // Strong and emphasis
        "[&_strong]:font-semibold",
        "[&_em]:italic",
        // Code
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",
        "[&_pre]:mb-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        // Blockquotes
        "[&_blockquote]:border-l-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        // Horizontal rules
        "[&_hr]:my-4 [&_hr]:border-border",
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
