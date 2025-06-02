import React from 'react';
import { Bot } from 'lucide-react';
import { isAgentsEndpoint, isAssistantsEndpoint } from 'librechat-data-provider';
import type {
  TModelSpec,
  TAgentsMap,
  TAssistantsMap,
  TEndpointsConfig,
} from 'librechat-data-provider';
import type { useLocalize } from '~/hooks';
import SpecIcon from '~/components/Chat/Menus/Endpoints/components/SpecIcon';
import { Endpoint, SelectedValues } from '~/common';

// 제공업체별 색상 맵
const providerColorMap: Record<string, string> = {
  'google': 'text-blue-600',
  'openai': 'text-emerald-500',
  'anthropic': 'text-red-500',
  'meta-llama': 'text-blue-700',
  'deepseek': 'text-indigo-500',
  'microsoft': 'text-blue-500',
  'mistral': 'text-purple-500',
  'cloudflare': 'text-orange-500',
  'perplexity': 'text-pink-500',
  'cohere': 'text-teal-500',
  'thudm': 'text-amber-500',
  'nousresearch': 'text-emerald-500',
  'sfrg': 'text-violet-600',
  'aleph': 'text-sky-500',
  '01-ai': 'text-rose-500',
  'databricks': 'text-orange-600'
};

export function filterItems<
  T extends {
    label: string;
    name?: string;
    value?: string;
    models?: Array<{ name: string; isGlobal?: boolean }>;
  },
>(
  items: T[],
  searchValue: string,
  agentsMap: TAgentsMap | undefined,
  assistantsMap: TAssistantsMap | undefined,
): T[] | null {
  const searchTermLower = searchValue.trim().toLowerCase();
  if (!searchTermLower) {
    return null;
  }

  return items.filter((item) => {
    const itemMatches =
      item.label.toLowerCase().includes(searchTermLower) ||
      (item.name && item.name.toLowerCase().includes(searchTermLower)) ||
      (item.value && item.value.toLowerCase().includes(searchTermLower));

    if (itemMatches) {
      return true;
    }

    if (item.models && item.models.length > 0) {
      return item.models.some((modelId) => {
        if (modelId.name.toLowerCase().includes(searchTermLower)) {
          return true;
        }

        if (isAgentsEndpoint(item.value) && agentsMap && modelId.name in agentsMap) {
          const agentName = agentsMap[modelId.name]?.name;
          return typeof agentName === 'string' && agentName.toLowerCase().includes(searchTermLower);
        }

        if (isAssistantsEndpoint(item.value) && assistantsMap) {
          const endpoint = item.value ?? '';
          const assistant = assistantsMap[endpoint][modelId.name];
          if (assistant && typeof assistant.name === 'string') {
            return assistant.name.toLowerCase().includes(searchTermLower);
          }
          return false;
        }

        return false;
      });
    }

    return false;
  });
}

export function filterModels(
  endpoint: Endpoint,
  models: string[],
  searchValue: string,
  agentsMap: TAgentsMap | undefined,
  assistantsMap: TAssistantsMap | undefined,
): string[] {
  const searchTermLower = searchValue.trim().toLowerCase();
  if (!searchTermLower) {
    return models;
  }

  return models.filter((modelId) => {
    let modelName = modelId;

    if (isAgentsEndpoint(endpoint.value) && agentsMap && agentsMap[modelId]) {
      modelName = agentsMap[modelId].name || modelId;
    } else if (
      isAssistantsEndpoint(endpoint.value) &&
      assistantsMap &&
      assistantsMap[endpoint.value]
    ) {
      const assistant = assistantsMap[endpoint.value][modelId];
      modelName =
        typeof assistant.name === 'string' && assistant.name ? (assistant.name as string) : modelId;
    }

    return modelName.toLowerCase().includes(searchTermLower);
  });
}

export function getSelectedIcon({
  mappedEndpoints,
  selectedValues,
  modelSpecs,
  endpointsConfig,
}: {
  mappedEndpoints: Endpoint[];
  selectedValues: SelectedValues;
  modelSpecs: TModelSpec[];
  endpointsConfig: TEndpointsConfig;
}): React.ReactNode | null {
  const { endpoint, model, modelSpec } = selectedValues;

  if (modelSpec) {
    const spec = modelSpecs.find((s) => s.name === modelSpec);
    if (!spec) {
      return null;
    }
    const { showIconInHeader = true } = spec;
    if (!showIconInHeader) {
      return null;
    }
    return React.createElement(SpecIcon, {
      currentSpec: spec,
      endpointsConfig,
    });
  }

  if (endpoint && model) {
    const selectedEndpoint = mappedEndpoints.find((e) => e.value === endpoint);
    if (!selectedEndpoint) {
      return null;
    }

    if (selectedEndpoint.modelIcons?.[model]) {
      const iconUrl = selectedEndpoint.modelIcons[model];
      return React.createElement(
        'div',
        { className: 'h-5 w-5 overflow-hidden rounded-full' },
        React.createElement('img', {
          src: iconUrl,
          alt: model,
          className: 'h-full w-full object-cover',
        }),
      );
    }

    return (
      selectedEndpoint.icon ||
      React.createElement(Bot, {
        size: 20,
        className: 'icon-md shrink-0 text-text-primary',
      })
    );
  }

  if (endpoint) {
    const selectedEndpoint = mappedEndpoints.find((e) => e.value === endpoint);
    return selectedEndpoint?.icon || null;
  }

  return null;
}

export const getDisplayValue = ({
  localize,
  mappedEndpoints,
  selectedValues,
  modelSpecs,
}: {
  localize: ReturnType<typeof useLocalize>;
  selectedValues: SelectedValues;
  mappedEndpoints: Endpoint[];
  modelSpecs: TModelSpec[];
}) => {
  if (selectedValues.modelSpec) {
    const spec = modelSpecs.find((s) => s.name === selectedValues.modelSpec);
    return spec?.label || spec?.name || localize('com_ui_select_model');
  }

  if (selectedValues.model && selectedValues.endpoint) {
    const endpoint = mappedEndpoints.find((e) => e.value === selectedValues.endpoint);
    if (!endpoint) {
      return localize('com_ui_select_model');
    }

    if (
      isAgentsEndpoint(endpoint.value) &&
      endpoint.agentNames &&
      endpoint.agentNames[selectedValues.model]
    ) {
      return endpoint.agentNames[selectedValues.model];
    }

    if (
      isAssistantsEndpoint(endpoint.value) &&
      endpoint.assistantNames &&
      endpoint.assistantNames[selectedValues.model]
    ) {
      return endpoint.assistantNames[selectedValues.model];
    }

    return selectedValues.model;
  }

  if (selectedValues.endpoint) {
    const endpoint = mappedEndpoints.find((e) => e.value === selectedValues.endpoint);
    return endpoint?.label || localize('com_ui_select_model');
  }

  return localize('com_ui_select_model');
};

// 제공업체 이름 포맷팅 함수
export const formatProviderName = (provider: string): string => {
  switch (provider.toLowerCase()) {
    case 'deepseek':
      return 'DeepSeek';
    case 'openai':
      return 'OpenAI';
    case 'openrouter':
      return 'OpenRouter';
    case 'meta-llama':
      return 'Meta-Llama';
    default:
      return provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase();
  }
};

export const formatModelName = (
  modelName: string,
  endpoint: string,
) => {
  if (endpoint.toLowerCase() === 'openrouter' && modelName.includes('/')) {
    const parts = modelName.split('/');
    const provider = parts[0];
    let modelPart = parts.slice(1).join('/');

    // :free를 직접 -free로 대체
    if (modelPart.includes(':free')) {
      modelPart = modelPart.replace(':free', 'free');
    }

    const colorClass = providerColorMap[provider.toLowerCase()] || 'text-slate-500';

    if (modelPart.endsWith('free')) {
      const basePart = modelPart.substring(0, modelPart.length - 4);

      return React.createElement(
        'div',
        { className: 'flex items-center' },
        React.createElement('span', { className: `font-medium ${colorClass} opacity-90` }, formatProviderName(provider)),
        React.createElement('span', { className: 'ml-2 font-medium opacity-90' }, basePart),
        React.createElement('span', { className: 'ml-2 text-pink-400 font-medium opacity-90 italic' }, 'free')
      );
    }

    return React.createElement(
      'div',
      { className: 'flex items-center' },
      React.createElement('span', { className: `font-medium ${colorClass} opacity-90` }, formatProviderName(provider)),
      React.createElement('span', { className: 'ml-2 font-medium opacity-90' }, modelPart)
    );
  }

  return modelName;
};
