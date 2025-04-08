import React from 'react';
import { motion } from 'framer-motion';
import { File } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';
import store from '~/store';

export function ArtifactButton() {
  const localize = useLocalize();
  const [codeArtifacts, setCodeArtifacts] = useRecoilState(store.codeArtifacts);
  const [includeShadcnui, setIncludeShadcnui] = useRecoilState(store.includeShadcnui);
  const [customPromptMode, setCustomPromptMode] = useRecoilState(store.customPromptMode);

  const handleToggle = (e: React.MouseEvent) => {
    // 이벤트 전파 중지
    e.preventDefault();
    e.stopPropagation();
    
    const newValue = !codeArtifacts;
    setCodeArtifacts(newValue);
    // 아티팩트 기능을 끄면 관련 설정도 함께 끔
    if (!newValue) {
      setIncludeShadcnui(false);
      setCustomPromptMode(false);
    }
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      <div className="badge-icon h-full">
        <motion.button
          type="button"
          onClick={handleToggle}
          className={cn(
            'group -ml-1 relative inline-flex items-center gap-1.5 rounded-full border border-border-medium text-[14px] font-medium transition-shadow',
            'p-1 pt-1.5 px-3 mt-1 md:w-full',
            codeArtifacts
              ? 'bg-surface-active shadow-md'
              : 'bg-surface-chat shadow-sm hover:bg-surface-hover hover:shadow-md',
            'active:scale-95 active:shadow-inner',
          )}
          transition={{ type: 'tween', duration: 0.1, ease: 'easeOut' }}
        >
          <File className="size-5" />
          <span>Artifact</span>
        </motion.button>
      </div>
    </div>
  );
} 