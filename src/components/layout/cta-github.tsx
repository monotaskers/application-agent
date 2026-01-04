import React from "react";
import { Button } from "@/components/ui/button";
import { RiGithubLine } from "@remixicon/react";

export default function CtaGithub() {
  // Use environment variable for GitHub repository URL
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_REPO_URL;

  // Don't render the CTA if no GitHub URL is configured
  if (!githubUrl) {
    return null;
  }

  return (
    <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
      <a
        href={githubUrl}
        rel="noopener noreferrer"
        target="_blank"
        className="dark:text-foreground"
      >
        <RiGithubLine />
      </a>
    </Button>
  );
}
