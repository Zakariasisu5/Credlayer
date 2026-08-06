import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language: string;
  label?: string;
  showLineNumbers?: boolean;
};

export function CodeBlock({ code, language, label, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass rounded-lg overflow-hidden max-w-full min-w-0">
      {label && (
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 sm:px-4 py-2">
          <span className="text-[11px] sm:text-xs text-muted-foreground font-mono truncate">{label}</span>
          <span className="text-[11px] sm:text-xs text-muted-foreground shrink-0">{language}</span>
        </div>
      )}
      <div className="relative min-w-0">
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10 glass rounded-md p-2 min-h-9 min-w-9 flex items-center justify-center hover:bg-elevated-strong transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <CheckCircle2 className="size-4 text-success" />
          ) : (
            <Copy className="size-4 text-muted-foreground" />
          )}
        </button>
        <pre className="overflow-x-auto max-w-full p-3 pr-12 sm:p-4 sm:pr-14 text-[12px] sm:text-sm font-mono leading-relaxed">
          <code className={showLineNumbers ? "block" : ""}>
            {highlightCode(code, language)}
          </code>
        </pre>
      </div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function html(markup: string): React.ReactNode {
  return <span dangerouslySetInnerHTML={{ __html: markup }} />;
}

function highlightCode(code: string, language: string): React.ReactNode {
  const src = escapeHtml(code);

  if (language === "json") {
    return html(
      src
        .replace(/"([^"]+)":/g, '"<span class="text-accent">$1</span>":')
        .replace(/: ("(?:[^"]*)")/g, ': <span class="text-success">$1</span>'),
    );
  }

  if (language === "bash" || language === "shell") {
    return html(
      src
        .replace(/(^|\s)(--?[\w-]+)/g, '$1<span class="text-accent">$2</span>')
        .replace(/(https?:\/\/[^\s"'<]+)/g, '<span class="text-success">$1</span>')
        .replace(/^(curl|npm|pip|yarn|pnpm|git)\b/gm, '<span class="text-gold">$1</span>'),
    );
  }

  if (language === "python") {
    return html(
      src
        .replace(
          /\b(def|class|import|from|return|if|else|elif|for|while|try|except|with|as|in|is|and|or|not|True|False|None)\b/g,
          '<span class="text-accent">$1</span>',
        )
        .replace(/\b(print|len|str|int|float|list|dict|set|tuple)\b/g, '<span class="text-gold">$1</span>'),
    );
  }

  if (language === "javascript" || language === "typescript") {
    return html(
      src.replace(
        /\b(const|let|var|function|async|await|return|if|else|for|while|try|catch|import|export|from|default|class|extends|new|this|typeof|instanceof)\b/g,
        '<span class="text-accent">$1</span>',
      ),
    );
  }

  return code;
}

