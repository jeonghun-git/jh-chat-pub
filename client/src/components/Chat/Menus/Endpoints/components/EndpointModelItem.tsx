import React from 'react';
import { EarthIcon } from 'lucide-react';
import { isAgentsEndpoint, isAssistantsEndpoint } from 'librechat-data-provider';
import type { Endpoint } from '~/common';
import { useModelSelectorContext } from '../ModelSelectorContext';
import { CustomMenuItem as MenuItem } from '../CustomMenu';
import { formatModelName, formatProviderName } from '../utils';
import { cn } from '~/utils';

interface EndpointModelItemProps {
  modelId: string | null;
  endpoint: Endpoint;
  isSelected: boolean;
}

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

// 공백을 더 추가하기 위한 사용자 정의 함수
const formatModelWithSpace = (modelName: string, endpointValue: string) => {
  if (!modelName) return null;

  if (endpointValue.toLowerCase() === 'openrouter' && modelName.includes('/')) {
    const parts = modelName.split('/');
    const provider = parts[0];
    let modelPart = parts.slice(1).join('/');

    // :free를 직접 대체
    if (modelPart.includes(':free')) {
      modelPart = modelPart.replace(':free', 'free');
    }

    // 제공업체에 맞는 색상 선택 (없으면 회색 사용)
    const colorClass = providerColorMap[provider.toLowerCase()] || 'text-slate-500';

    // 모델명의 마지막 '-free' 부분만 특별히 표시
    if (modelPart.endsWith('free')) {
      const basePart = modelPart.substring(0, modelPart.length - 4);
      return (
        <div className="flex items-center">
          <span className={`font-medium ${colorClass} w-[85px] inline-block opacity-90`}>{formatProviderName(provider)}</span>
          <span className="ml-4 truncate opacity-90 font-light">{basePart}</span>
          <span className="ml-3 text-pink-400 font-medium opacity-90 italic">free</span>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <span className={`font-medium ${colorClass} w-[85px] inline-block opacity-90`}>{formatProviderName(provider)}</span>
        <span className="ml-4 opacity-90 font-light">{modelPart}</span>
      </div>
    );
  }

  return <span>{modelName}</span>;
};

export function EndpointModelItem({ modelId, endpoint, isSelected }: EndpointModelItemProps) {
  const { handleSelectModel } = useModelSelectorContext();
  let isGlobal = false;
  let modelName = modelId;
  const avatarUrl = endpoint?.modelIcons?.[modelId ?? ''] || null;

  // Use custom names if available
  if (endpoint && modelId && isAgentsEndpoint(endpoint.value) && endpoint.agentNames?.[modelId]) {
    modelName = endpoint.agentNames[modelId];

    const modelInfo = endpoint?.models?.find((m) => m.name === modelId);
    isGlobal = modelInfo?.isGlobal ?? false;
  } else if (
    endpoint &&
    modelId &&
    isAssistantsEndpoint(endpoint.value) &&
    endpoint.assistantNames?.[modelId]
  ) {
    modelName = endpoint.assistantNames[modelId];
  }

  return (
    <MenuItem
      key={modelId}
      onClick={() => handleSelectModel(endpoint, modelId ?? '')}
      className="flex h-8 w-full cursor-pointer items-center justify-start rounded-lg px-3 py-2 text-sm"
    >
      <div className="flex items-center gap-2">
        {avatarUrl ? (
          <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full">
            <img src={avatarUrl} alt={modelName ?? ''} className="h-full w-full object-cover" />
          </div>
        ) : (isAgentsEndpoint(endpoint.value) || isAssistantsEndpoint(endpoint.value)) &&
          endpoint.icon ? (
          <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full">
            {endpoint.icon}
          </div>
        ) : null}
        {formatModelWithSpace(modelName || '', endpoint.value)}
      </div>
      {isGlobal && <EarthIcon className="ml-auto size-4 text-green-400" />}
      {isSelected && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
          aria-label="Selected"
        >
          <title>Selected</title>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16.0755 7.93219C16.5272 8.25003 16.6356 8.87383 16.3178 9.32549L11.5678 16.0755C11.3931 16.3237 11.1152 16.4792 10.8123 16.4981C10.5093 16.517 10.2142 16.3973 10.0101 16.1727L7.51006 13.4227C7.13855 13.014 7.16867 12.3816 7.57733 12.0101C7.98598 11.6386 8.61843 11.6687 8.98994 12.0773L10.6504 13.9039L14.6822 8.17451C15 7.72284 15.6238 7.61436 16.0755 7.93219Z"
            fill="currentColor"
          />
        </svg>
      )}
    </MenuItem>
  );
}

export function renderEndpointModels(
  endpoint: Endpoint | null,
  models: Array<{ name: string; isGlobal?: boolean }>,
  selectedModel: string | null,
  filteredModels?: string[],
) {
  const modelsToRender = filteredModels || models.map((model) => model.name);

  // 중복 제거
  const uniqueModels = [...new Set(modelsToRender)];

  return uniqueModels.map(
    (modelId, index) =>
      endpoint && (
        <EndpointModelItem
          key={`${endpoint.value}-${modelId}-${index}`}
          modelId={modelId}
          endpoint={endpoint}
          isSelected={selectedModel === modelId}
        />
      ),
  );
}
