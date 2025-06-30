import React from 'react';

interface ExportFormatSelectorProps {
  selectedFormat: string;
  onChange: (format: string) => void;
}

const formats = [
  { label: 'Markdown (.md)', value: 'markdown' },
  { label: 'Plain Text (.txt)', value: 'text' },
  { label: 'HTML (.html)', value: 'html' },
];

export const ExportFormatSelector: React.FC<ExportFormatSelectorProps> = ({ selectedFormat, onChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full">
      <select
        value={selectedFormat}
        onChange={e => onChange(e.target.value)}
        className="select-modern w-full"
      >
        {formats.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
    </div>
  );
};
