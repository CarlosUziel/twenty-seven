import React from 'react';
import { Brain, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <h3 className="font-bold text-foreground">The Council of the Twenty-Seven</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              An AI-powered platform that explores life questions through the lens of different 
              philosophical traditions, helping you gain diverse perspectives on important decisions.
            </p>
          </div>

          {/* How it Works */}
          <div>
            <h3 className="font-bold text-foreground mb-4">How it Works</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Share your life question or dilemma</li>
              <li>• Select philosophical perspectives to explore</li>
              <li>• Receive thoughtful advice from each viewpoint</li>
              <li>• Get a synthesized conclusion combining insights</li>
            </ul>
          </div>

          {/* Technical */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Technical Stack</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Next.js 14 + TypeScript frontend</li>
              <li>• FastAPI Python backend</li>
              <li>• Tailwind CSS styling</li>
              <li>• AI language model integration</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Built with modern web technologies for philosophical exploration.
              </p>
            </div>
          </div>
        </div>
        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <span className="inline-block bg-accent/10 border border-accent text-accent text-sm rounded px-4 py-2 font-medium shadow-sm">
            ⚠️ Answers are AI generated and do not constitute professional advice. Not reviewed by a certified professional.
          </span>
        </div>
      </div>
    </footer>
  );
};
