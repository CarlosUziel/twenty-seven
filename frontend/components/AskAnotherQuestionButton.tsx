import React from 'react';
import { Shuffle } from 'lucide-react';

interface AskAnotherQuestionButtonProps {
  onClick: () => void;
  className?: string;
}

export const AskAnotherQuestionButton: React.FC<AskAnotherQuestionButtonProps> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 py-3 text-base mt-2 ${className || ''}`}
    type="button"
  >
    <Shuffle className="h-5 w-5 text-accent" />
    Ask Another Question
  </button>
);
