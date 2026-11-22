import { siGithub, siHuggingface } from "simple-icons";
import { Mail } from "lucide-react";
import type { SocialKey } from "@/lib/portfolio-data";

type IconProps = { className?: string };

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={siGithub.path} />
    </svg>
  );
}

export function HuggingFaceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={siHuggingface.path} />
    </svg>
  );
}

/** Simple LinkedIn-style "in" mark (LinkedIn is not distributed in simple-icons). */
export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4.5 3A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3h-15Zm2.9 3.6a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 0 1 0-3.1ZM6.05 10.8h2.7v7.3h-2.7v-7.3Zm4.35 0h2.6v1.05c.38-.66 1.3-1.25 2.62-1.25 2.4 0 2.98 1.48 2.98 3.5v4h-2.7v-3.6c0-.95-.18-1.85-1.36-1.85-1.17 0-1.44.8-1.44 1.8v3.65h-2.7v-7.3Z" />
    </svg>
  );
}

export function SocialIcon({ name, className }: { name: SocialKey; className?: string }) {
  switch (name) {
    case "github":
      return <GitHubIcon className={className} />;
    case "huggingface":
      return <HuggingFaceIcon className={className} />;
    case "linkedin":
      return <LinkedInIcon className={className} />;
    default:
      return <Mail className={className} aria-hidden strokeWidth={1.75} />;
  }
}
