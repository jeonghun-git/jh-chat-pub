import { memo } from 'react';
import { EModelEndpoint, KnownEndpoints } from 'librechat-data-provider';
import { CustomMinimalIcon } from '~/components/svg';
import { IconContext } from '~/common';
import { cn } from '~/utils';

// 아이콘 파일들을 직접 import
import anyscaleIcon from '../../../public/assets/anyscale.png';
import apipieIcon from '../../../public/assets/apipie.png';
import cohereIcon from '../../../public/assets/cohere.png';
import deepseekIcon from '../../../public/assets/deepseek.svg';
import fireworksIcon from '../../../public/assets/fireworks.png';
import groqIcon from '../../../public/assets/groq.png';
import huggingfaceIcon from '../../../public/assets/huggingface.svg';
import mistralIcon from '../../../public/assets/mistral.png';
import mlxIcon from '../../../public/assets/mlx.png';
import ollamaIcon from '../../../public/assets/ollama.png';
import openrouterIcon from '../../../public/assets/openrouter.png';
import perplexityIcon from '../../../public/assets/perplexity.png';
import shuttleaiIcon from '../../../public/assets/shuttleai.png';
import togetherIcon from '../../../public/assets/together.png';
import unifyIcon from '../../../public/assets/unify.webp';
import xaiIcon from '../../../public/assets/xai.svg';

const knownEndpointAssets = {
  [KnownEndpoints.anyscale]: anyscaleIcon,
  [KnownEndpoints.apipie]: apipieIcon,
  [KnownEndpoints.cohere]: cohereIcon,
  [KnownEndpoints.deepseek]: deepseekIcon,
  [KnownEndpoints.fireworks]: fireworksIcon,
  [KnownEndpoints.groq]: groqIcon,
  [KnownEndpoints.huggingface]: huggingfaceIcon,
  [KnownEndpoints.mistral]: mistralIcon,
  [KnownEndpoints.mlx]: mlxIcon,
  [KnownEndpoints.ollama]: ollamaIcon,
  [KnownEndpoints.openrouter]: openrouterIcon,
  [KnownEndpoints.perplexity]: perplexityIcon,
  [KnownEndpoints.shuttleai]: shuttleaiIcon,
  [KnownEndpoints['together.ai']]: togetherIcon,
  [KnownEndpoints.unify]: unifyIcon,
  [KnownEndpoints.xai]: xaiIcon,
};

const knownEndpointClasses = {
  [KnownEndpoints.cohere]: {
    [IconContext.landing]: 'p-2',
  },
  [KnownEndpoints.xai]: {
    [IconContext.landing]: 'p-2',
    [IconContext.menuItem]: 'bg-white',
    [IconContext.message]: 'bg-white',
    [IconContext.nav]: 'bg-white',
  },
};

const getKnownClass = ({
  currentEndpoint,
  context = '',
  className,
}: {
  currentEndpoint: string;
  context?: string;
  className: string;
}) => {
  if (currentEndpoint === KnownEndpoints.openrouter) {
    return className;
  }

  const match = knownEndpointClasses[currentEndpoint]?.[context] ?? '';
  const defaultClass = context === IconContext.landing ? '' : className;

  return cn(match, defaultClass);
};

function UnknownIcon({
  className = '',
  endpoint: _endpoint,
  iconURL = '',
  context,
}: {
  iconURL?: string;
  className?: string;
  endpoint?: EModelEndpoint | string | null;
  context?: 'landing' | 'menu-item' | 'nav' | 'message';
}) {
  const endpoint = _endpoint ?? '';
  if (!endpoint) {
    return <CustomMinimalIcon className={className} />;
  }

  const currentEndpoint = endpoint.toLowerCase();

  if (iconURL) {
    return <img className={className} src={iconURL} alt={`${endpoint} Icon`} />;
  }

  const assetPath: string | undefined = knownEndpointAssets[currentEndpoint];

  if (!assetPath) {
    return <CustomMinimalIcon className={className} />;
  }

  return (
    <img
      className={getKnownClass({
        currentEndpoint,
        context: context,
        className,
      })}
      src={assetPath}
      alt={`${currentEndpoint} Icon`}
    />
  );
}

export default memo(UnknownIcon);
