import React from 'react';

interface ProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  providers: string[];
  availableModels: string[];
  disabled?: boolean;
  className?: string;
  providerAvailability?: {[key: string]: boolean};
}

const PROVIDER_LABELS: Record<string, string> = {
  local: 'Local (LM Studio)',
  huggingface: 'Hugging Face',
  openrouter: 'OpenRouter',
};

/**
 * Reusable provider and model selection component.
 * Handles provider switching and model selection for both answer generation and conclusion generation.
 */
export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  selectedModel,
  onModelChange,
  providers,
  availableModels,
  disabled = false,
  className = '',
  providerAvailability = {},
}) => {
  return (
    <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
      <div className="flex-1">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          AI Provider
        </label>
        <select
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.target.value)}
          disabled={disabled}
          className="w-full select-modern"
        >
          {providers.map((provider) => (
            <option key={provider} value={provider}>
              {PROVIDER_LABELS[provider] || provider}
              {providerAvailability[provider] === false ? ' (Unavailable)' : ''}
            </option>
          ))}
        </select>
        {providers.length === 0 && (
          <p className="text-xs text-red-500 mt-1">
            No providers available. Check your configuration.
          </p>
        )}
        {selectedProvider === 'openrouter' && (
          <p className="text-xs text-yellow-600 mt-2">
            <strong>Warning:</strong> When using OpenRouter, your data will be sent to a third party. Privacy is not guaranteed.
          </p>
        )}
      </div>
      
      <div className="flex-1">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Model
        </label>
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          disabled={disabled || availableModels.length === 0}
          className="w-full select-modern"
        >
          {availableModels.length > 0 ? (
            availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))
          ) : (
            <option value="">No models available</option>
          )}
        </select>
        {availableModels.length === 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            No models available for this provider
          </p>
        )}
      </div>
    </div>
  );
};
