'use client'

import { marked } from 'marked';

interface SummaryDisplayProps {
  summary: string;
}

export default function SummaryDisplay({ summary }: SummaryDisplayProps) {
  // Convert the summary to HTML using marked
  const htmlContent = marked(summary);

  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <div 
        className="space-y-8"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <style jsx global>{`
        .prose h2 {
          color: #fff;
          font-size: 1.8rem;
          margin-top: 2.5rem;
          margin-bottom: 1.2rem;
          font-weight: 800;
          background: linear-gradient(to right, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .prose p {
          color: #e4e4e7;
          line-height: 1.8;
          margin-bottom: 1.2rem;
          font-size: 1.1rem;
        }
        .prose ul {
          list-style-type: none;
          padding-left: 0;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
        }
        .prose li {
          color: #e4e4e7;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          position: relative;
          font-size: 1.1rem;
        }
        .prose li:before {
          content: "•";
          color: #818cf8;
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        .prose blockquote {
          border-left: 4px solid #818cf8;
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          background: rgba(129, 140, 248, 0.1);
          border-radius: 0.5rem;
        }
        .prose blockquote p {
          color: #c7d2fe;
          font-style: italic;
          margin: 0;
        }
        .prose hr {
          border-color: #4c1d95;
          margin: 2.5rem 0;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
