import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExportFormatSelector } from './ExportFormatSelector';
import React from 'react';
import { Download, FileText } from 'lucide-react';

interface ExportPanelProps {
  question: string;
  generatedAnswers: Map<string, any>;
  conclusion: string;
  exportFormat: string;
  setExportFormat: (format: string) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  question,
  generatedAnswers,
  conclusion,
  exportFormat,
  setExportFormat,
}) => {
  const handleExport = async () => {
    let content = '';
    let mime = 'text/markdown';
    let filename = 'twenty-seven-export.md';
    if (exportFormat === 'markdown') {
      content += `# Your Question\n\n`;
      content += question ? `${question}\n\n` : '';
      if (generatedAnswers.size > 0) {
        content += `# Perspectives & Answers\n\n`;
        generatedAnswers.forEach((answer, perspective) => {
          content += `## ${perspective}\n`;
          content += answer.answer ? `${answer.answer}\n` : '';
          if (answer.metadata) {
            content += `\n**Metadata:**\n`;
            Object.entries(answer.metadata).forEach(([k, v]) => {
              content += `- ${k}: ${v}\n`;
            });
          }
          content += '\n';
        });
      }
      if (conclusion) {
        content += `# Synthesized Conclusion\n\n`;
        content += `${conclusion}\n`;
      }
      mime = 'text/markdown';
      filename = 'twenty-seven-export.md';
    } else if (exportFormat === 'text') {
      content += 'Your Question\n\n';
      content += question ? `${question}\n\n` : '';
      if (generatedAnswers.size > 0) {
        content += 'Perspectives & Answers\n\n';
        generatedAnswers.forEach((answer, perspective) => {
          content += `${perspective}\n`;
          content += answer.answer ? `${answer.answer}\n` : '';
          if (answer.metadata) {
            content += '\nMetadata:\n';
            Object.entries(answer.metadata).forEach(([k, v]) => {
              content += `- ${k}: ${v}\n`;
            });
          }
          content += '\n';
        });
      }
      if (conclusion) {
        content += 'Synthesized Conclusion\n\n';
        content += `${conclusion}\n`;
      }
      mime = 'text/plain';
      filename = 'twenty-seven-export.txt';
    } else if (exportFormat === 'html') {
      content += `<h1>Your Question</h1>\n`;
      content += question ? `<p>${question}</p>\n` : '';
      if (generatedAnswers.size > 0) {
        content += `<h2>Perspectives & Answers</h2>\n`;
        generatedAnswers.forEach((answer, perspective) => {
          content += `<h3>${perspective}</h3>\n`;
          content += answer.answer ? `<p>${answer.answer}</p>\n` : '';
          if (answer.metadata) {
            content += `<ul>\n`;
            Object.entries(answer.metadata).forEach(([k, v]) => {
              content += `<li><strong>${k}:</strong> ${v}</li>\n`;
            });
            content += `</ul>\n`;
          }
        });
      }
      if (conclusion) {
        content += `<h2>Synthesized Conclusion</h2>\n`;
        content += `<p>${conclusion}</p>\n`;
      }
      mime = 'text/html';
      filename = 'twenty-seven-export.html';
    }
    // Download file
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <Card className="shadow-xl mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-accent" />
          Export Your Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="flex-1 w-full">
            <select
              value={exportFormat}
              onChange={e => setExportFormat(e.target.value)}
              className="w-full rounded-lg border-none shadow-md bg-background text-foreground px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200 appearance-none cursor-pointer hover:bg-primary/5"
            >
              <option value="markdown">Markdown</option>
              <option value="text">Plain Text</option>
              <option value="html">HTML</option>
            </select>
          </div>
          <Button
            onClick={handleExport}
            className="w-full md:w-auto btn-primary font-semibold shadow-lg transition-colors duration-200"
            size="lg"
            variant="default"
          >
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
