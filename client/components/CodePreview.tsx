import { useState } from 'react';

interface CodePreviewProps {
  code: string;
  language?: string;
  title?: string;
  onClose?: () => void;
}

// Simple syntax highlighter without external dependencies
function highlightCode(code: string, language: string = 'typescript'): string {
  const keywords = ['const', 'let', 'var', 'function', 'async', 'await', 'import', 'export', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'default', 'from', 'as', 'new'];
  const types = ['string', 'number', 'boolean', 'any', 'void', 'null', 'undefined', 'Promise', 'Array', 'Object'];

  let highlighted = code;

  // Highlight strings
  highlighted = highlighted.replace(/(['"`])([^'""`]*)\1/g, '<span class="text-green-400">"$2"</span>');

  // Highlight keywords
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="text-primary">${keyword}</span>`);
  });

  // Highlight types
  types.forEach((type) => {
    const regex = new RegExp(`\\b${type}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="text-secondary">${type}</span>`);
  });

  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-yellow-400">$1</span>');

  return highlighted;
}

export function CodePreview({ code, language = 'typescript', title = 'Starter Code', onClose }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl glassmorphism overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{language.toUpperCase()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
              }`}
            >
              {copied ? '✓ Copied' : '📋 Copy Code'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Code container */}
        <div className="flex-1 overflow-auto">
          <pre className="p-6 text-sm font-mono text-foreground">
            <code dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
          </pre>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 bg-card/30 text-xs text-muted-foreground">
          <p>💡 Tip: Copy this code and paste it into your project to get started!</p>
        </div>
      </div>
    </div>
  );
}

// Modal wrapper for code preview
export function CodePreviewModal({
  isOpen,
  code,
  language,
  title,
  onClose,
}: {
  isOpen: boolean;
  code: string;
  language?: string;
  title?: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <CodePreview code={code} language={language} title={title} onClose={onClose} />
  );
}

// Inline code preview with tab support
interface InlineCodePreviewProps {
  snippets: Array<{ name: string; code: string; language?: string }>;
}

export function InlineCodePreview({ snippets }: InlineCodePreviewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentSnippet = snippets[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full rounded-lg glassmorphism overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border bg-card/30">
        {snippets.map((snippet, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === index
                ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {snippet.name}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 px-4">
          <button
            onClick={handleCopy}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'bg-primary/20 text-primary hover:bg-primary/30'
            }`}
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
      </div>

      {/* Code display */}
      <div className="overflow-auto max-h-96">
        <pre className="p-6 text-sm font-mono text-foreground">
          <code dangerouslySetInnerHTML={{ __html: highlightCode(currentSnippet.code, currentSnippet.language || 'typescript') }} />
        </pre>
      </div>
    </div>
  );
}
