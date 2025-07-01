'use client';

/**
 * Main application page for The Council of the Twenty-Seven.
 * Handles question input, perspective selection, answer generation, synthesis, and export.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/loading';
import { apiService, type AnswerResponse } from '@/lib/api';
import { getRandomExample, exampleQuestions } from '@/lib/examples';
import { Brain, Sparkles, BookOpen, Users, MessageCircle, Lightbulb, Shuffle, HelpCircle, ChevronDown, ChevronUp, Plus, X, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import { ExportPanel } from '@/components/ExportPanel';
import { AskAnotherQuestionButton } from '@/components/AskAnotherQuestionButton';
import { ProviderSelector } from '@/components/ProviderSelector';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const [isQuestionBarOpen, setIsQuestionBarOpen] = useState(false);
  const [perspectives, setPerspectives] = useState<Record<string, string>>({});
  const [perspectiveNames, setPerspectiveNames] = useState<string[]>([]);
  const [selectedPerspective, setSelectedPerspective] = useState<string>('');
  const [generatedAnswers, setGeneratedAnswers] = useState<Map<string, AnswerResponse>>(new Map());
  const [activeTab, setActiveTab] = useState<string>('');
  const [conclusion, setConclusion] = useState('');
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [isGeneratingConclusion, setIsGeneratingConclusion] = useState(false);
  const [isLoadingPerspectives, setIsLoadingPerspectives] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState('markdown');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [providers, setProviders] = useState<string[]>(['local', 'openrouter']);
  const [selectedProvider, setSelectedProvider] = useState<string>('local');
  const [providerAvailability, setProviderAvailability] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    loadPerspectives();
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      // Use standardized apiService for model fetching
      apiService.getModels(selectedProvider)
        .then((models) => {
          setAvailableModels(models);
          if (models.length > 0) setSelectedModel(models[0]);
        })
        .catch((error) => {
          console.error(`Failed to fetch models for provider ${selectedProvider}:`, error);
          setError(`Failed to fetch models for provider ${selectedProvider}.`);
        });
    }
  }, [selectedProvider]);

  useEffect(() => {
    // Set first perspective as default when perspectives load
    const names = Object.keys(perspectives);
    setPerspectiveNames(names);
    if (names.length > 0 && !selectedPerspective) {
      setSelectedPerspective(names[0]);
    }
  }, [perspectives, selectedPerspective]);

  // Check provider availability on mount
  useEffect(() => {
    const checkProviders = async () => {
      const available: {[key: string]: boolean} = {};
      try {
        // Use standardized apiService for health checks
        const localData = await apiService.checkLocalInstance();
        available['local'] = !!localData.available;
      } catch { available['local'] = false; }
      try {
        const keysData = await apiService.checkApiKeys();
        available['openrouter'] = !!keysData.openrouter;
      } catch {
        available['openrouter'] = false;
      }
      setProviderAvailability(available);
      const filtered = ['local', 'openrouter'].filter(p => available[p]);
      setProviders(filtered);
      if (filtered.length > 0) setSelectedProvider(filtered[0]);
    };
    checkProviders();
  }, []);

  const loadPerspectives = async () => {
    setIsLoadingPerspectives(true);
    setError(null);
    try {
      const data = await apiService.getPerspectives();
      setPerspectives(data);
    } catch (error) {
      console.error('Failed to load perspectives:', error);
      setError('Failed to load philosophical perspectives. Please make sure the backend API is running.');
    } finally {
      setIsLoadingPerspectives(false);
    }
  };

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
  };

  const handleSubmitQuestion = () => {
    if (question.trim()) {
      setIsQuestionSubmitted(true);
      setIsQuestionBarOpen(false);
    }
  };

  const generateAnswer = async () => {
    if (!selectedPerspective || !question.trim()) return;
    
    setIsGeneratingAnswer(true);
    setError(null);

    try {
      const response = await apiService.getAnswer({
        question,
        perspective: selectedPerspective,
        model: selectedModel,
      });
      setGeneratedAnswers(prev => new Map(prev).set(selectedPerspective, response));
      
      // Set active tab to the newly generated answer
      setActiveTab(selectedPerspective);
    } catch (error) {
      console.error('Failed to generate answer:', error);
      setError('Failed to generate philosophical answer. Please try again.');
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  const generateConclusion = async () => {
    setIsGeneratingConclusion(true);
    setError(null);
    try {
      const answersObj = Object.fromEntries(
        Array.from(generatedAnswers.entries()).map(([k, v]) => [k, v.answer])
      );
      const response = await apiService.getConclusion({
        answers: answersObj,
        model: selectedModel,
      });
      setConclusion(response.conclusion);
      // Optionally store/display response.metadata
    } catch (error) {
      console.error('Failed to generate conclusion:', error);
      setError('Failed to generate philosophical synthesis. Please try again.');
    } finally {
      setIsGeneratingConclusion(false);
    }
  };

  const resetSession = () => {
    setQuestion('');
    setIsQuestionSubmitted(false);
    setIsQuestionBarOpen(false);
    setSelectedPerspective(perspectiveNames.length > 0 ? perspectiveNames[0] : '');
    setGeneratedAnswers(new Map());
    setActiveTab('');
    setConclusion('');
    setError(null);
  };

  const handleUseExample = () => {
    const example = getRandomExample();
    setQuestion(example);
  };

  const removeAnswer = (perspective: string) => {
    const newAnswers = new Map(generatedAnswers);
    newAnswers.delete(perspective);
    setGeneratedAnswers(newAnswers);
    
    // If we're removing the active tab, switch to another one or clear it
    if (activeTab === perspective) {
      const remaining = Array.from(newAnswers.keys());
      setActiveTab(remaining.length > 0 ? remaining[0] : '');
    }
  };

  // Collapsible metadata component
  const MetadataDisclosure: React.FC<{ metadata: any }> = ({ metadata }) => {
    const [open, setOpen] = useState(false);
    if (!metadata) return null;
    return (
      <div className="mt-4">
        <button
          className="text-xs text-gray-500 hover:text-primary flex items-center gap-1 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span>{open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
          <span>Show generation metadata</span>
        </button>
        {open && (
          <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-2 text-xs text-gray-700">
            <ul className="space-y-1">
              {Object.entries(metadata).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold mr-2">{key}:</span>
                  <span>{String(value)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold gradient-text">
            The Council of the Twenty-Seven
          </h1>
        </div>
        <p className="text-xl text-foreground mb-8">
          Explore life's questions through the wisdom of different philosophical perspectives
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8">
          <ErrorMessage 
            message={error} 
            onRetry={() => {
              setError(null);
              if (Object.keys(perspectives).length === 0) {
                loadPerspectives();
              }
            }} 
          />
        </div>
      )}

      {/* Loading Perspectives */}
      {isLoadingPerspectives && (
        <Card className="mb-8 shadow-xl">
          <CardContent>
            <LoadingSpinner text="Loading philosophical perspectives..." />
          </CardContent>
        </Card>
      )}

      {/* Question Input - Initial State */}
      {!isQuestionSubmitted && !isLoadingPerspectives && !error && (
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-accent" />
              What life question would you like to explore?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="For example: I'm considering a major career change but feel scared about the uncertainty. How should I approach this decision?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-32 mb-4"
            />
            {/* Question Suggestions */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">For the most helpful answers, please add as many details as possible about your situation, context, and what matters to you.</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Need inspiration? Try one of these:</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleUseExample}
                  className="ml-auto"
                >
                  <Shuffle className="h-4 w-4 mr-1" />
                  Random
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {exampleQuestions.slice(0, 3).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(example)}
                    className="text-left text-sm text-gray-600 hover:text-primary hover:bg-indigo-50 p-2 rounded transition-colors"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <Button 
                onClick={handleSubmitQuestion}
                disabled={!question.trim()}
                className="w-full btn-primary shadow-lg"
                size="lg"
              >
                Submit Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ask Another Question Button - Always visible, after input */}
      <div className="mb-8 flex justify-center">
        <AskAnotherQuestionButton onClick={resetSession} className="max-w-md" />
      </div>

      {/* Question Bar - Collapsed State */}
      {isQuestionSubmitted && (
        <Card className="mb-8 shadow-xl cursor-pointer hover:bg-primary/5 transition-colors"
          onClick={() => setIsQuestionBarOpen(!isQuestionBarOpen)}
          role="button"
          tabIndex={0}
          aria-expanded={isQuestionBarOpen}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-accent" />
                <span className="font-medium text-foreground">Your Question:</span>
                {!isQuestionBarOpen && (
                  <span className="text-muted-foreground truncate max-w-md">
                    {question.length > 80 ? `${question.substring(0, 80)}...` : question}
                  </span>
                )}
              </div>
              {isQuestionBarOpen ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </div>
            {isQuestionBarOpen && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-muted-foreground">{question}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Perspective Selection and Answer Generation */}
      {isQuestionSubmitted && !isLoadingPerspectives && !error && (
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-accent" />
              Choose a Philosophical Perspective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <div className="flex-1 w-full relative">
                <select 
                  value={selectedPerspective}
                  onChange={(e) => setSelectedPerspective(e.target.value)}
                  className="w-full rounded-lg border-none shadow-md bg-background text-foreground px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200 appearance-none cursor-pointer hover:bg-primary/5 mb-2 pr-10"
                  style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                >
                  {perspectiveNames.map((perspective) => (
                    <option key={perspective} value={perspective}>{perspective}</option>
                  ))}
                </select>
                {/* Down arrow icon for dropdown */}
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            {/* Perspective Description (summary) */}
            {selectedPerspective && (
              <div className="p-4 bg-gray-50 rounded-lg mt-4 mb-4">
                <span className="text-sm text-gray-700 font-medium text-justify block">{perspectives[selectedPerspective] || "A unique philosophical approach to life and decision-making"}</span>
              </div>
            )}
            {/* Provider and Model selection and Generate button below summary */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <ProviderSelector
                  selectedProvider={selectedProvider}
                  onProviderChange={handleProviderChange}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  providers={providers}
                  availableModels={availableModels}
                  disabled={isGeneratingAnswer}
                  providerAvailability={providerAvailability}
                />
              </div>
              <Button 
                onClick={generateAnswer}
                disabled={!selectedPerspective || isGeneratingAnswer || !selectedModel}
                className="w-full md:w-auto btn-primary shadow-lg transition-colors duration-200"
                size="lg"
                variant="default"
              >
                {isGeneratingAnswer ? (
                  <div className="flex items-center justify-center animate-pulse">
                    <Lightbulb className="h-5 w-5 animate-spin mr-2" />
                    Generating...
                  </div>
                ) : (
                  `Generate answer`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading Answer */}
      {isGeneratingAnswer && (
        <Card className="mb-8 shadow-xl">
          <CardContent>
            <LoadingSpinner text={`Generating philosophical insights from ${selectedPerspective}...`} />
          </CardContent>
        </Card>
      )}

      {/* Generated Answers - Tabbed Interface */}
      {generatedAnswers.size > 0 && (
        <div className="mb-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-accent" />
                Philosophical Perspectives
              </CardTitle>
              <CardDescription>
                Explore different philosophical approaches to your question.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
                {Array.from(generatedAnswers.keys()).map((perspective) => (
                  <button
                    key={perspective}
                    onClick={() => setActiveTab(perspective)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
                      activeTab === perspective
                        ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    {perspective}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAnswer(perspective);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab && generatedAnswers.has(activeTab) && (
                <div className="prose prose-neutral dark:prose-invert max-w-none text-justify">
                  <ReactMarkdown>
                    {generatedAnswers.get(activeTab)?.answer || ''}
                  </ReactMarkdown>
                  <MetadataDisclosure metadata={generatedAnswers.get(activeTab)?.metadata} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generate Conclusion */}
      {generatedAnswers.size > 1 && !conclusion && (
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-accent" />
              Generate Philosophical Synthesis
            </CardTitle>
            <CardDescription>
              Combine multiple perspectives into a unified philosophical conclusion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <div className="flex-1 w-full">
                <ProviderSelector
                  selectedProvider={selectedProvider}
                  onProviderChange={handleProviderChange}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  providers={providers}
                  availableModels={availableModels}
                  disabled={isGeneratingConclusion}
                  providerAvailability={providerAvailability}
                />
              </div>
              <Button 
                onClick={generateConclusion}
                disabled={isGeneratingConclusion || !selectedModel}
                className="w-full md:w-auto btn-primary shadow-lg transition-colors duration-200"
                size="lg"
                variant="default"
              >
                {isGeneratingConclusion ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full border-b-2 border-white h-4 w-4 mr-2"></div>
                    <span>Generating synthesis...</span>
                  </div>
                ) : (
                  `Generate synthesis from ${generatedAnswers.size} perspectives`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading Conclusion */}
      {isGeneratingConclusion && (
        <Card className="mb-8 shadow-xl">
          <CardContent>
            <LoadingSpinner text="Synthesizing philosophical perspectives..." />
          </CardContent>
        </Card>
      )}

      {/* Conclusion Panel */}
      {conclusion && (
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              Philosophical Synthesis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-lg text-foreground bg-background rounded p-4 border border-secondary text-justify">
              <ReactMarkdown>{conclusion}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Results Panel - only show if at least one answer exists, always last */}
      {generatedAnswers.size > 0 && (
        <ExportPanel
          question={question}
          generatedAnswers={generatedAnswers}
          conclusion={conclusion}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
        />
      )}
    </div>
  );
}
