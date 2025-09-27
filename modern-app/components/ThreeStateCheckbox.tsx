'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export type ThreeStateValue = 1 | 2 | 3; // none, minus, plus
type ThreeStateAltText = '☐' | '⊟' | '⊞';

type ThreeStateCheckboxProps = {
  value?: ThreeStateValue;
  onChange?: (value: ThreeStateValue) => void;
  label: string;
  disabled?: boolean;
  description?: string;
  textInput?: boolean;
};

const stateToImage = {
  1: '/public/images/3stage1.svg',
  2: '/public/images/3stage2.svg',
  3: '/public/images/3stage3.svg',
} as const satisfies Record<ThreeStateValue, string>;

const stateToAlt = {
  1: '☐', // empty box
  2: '⊟', // minus
  3: '⊞', // plus
} as const satisfies Record<ThreeStateValue, ThreeStateAltText>;

export function ThreeStateCheckbox({
  value = 1,
  onChange,
  label,
  disabled = false,
  description,
  textInput = false,
}: ThreeStateCheckboxProps) {
  const [localState, setLocalState] = useState<ThreeStateValue>(value);
  const [text, setText] = useState('');

  useEffect(() => {
    setLocalState(value);
  }, [value]);

  const handleClick = () => {
    if (disabled) return;
    
    const nextState = (localState === 3 ? 1 : localState + 1) as ThreeStateValue;
    setLocalState(nextState);
    onChange?.(nextState);
  };

  return (
    <div className="flex flex-col gap-2">
      <div 
        className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleClick}
      >
        <Image
          src={stateToImage[localState]}
          alt={stateToAlt[localState]}
          width={20}
          height={20}
        />
        <span className="text-sm">{label}</span>
        {description && (
          <span className="text-xs text-gray-500">({description})</span>
        )}
      </div>
      {textInput && localState > 0 && (
        <textarea
          className="w-full p-2 text-sm border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add details..."
          rows={2}
        />
      )}
    </div>
  );
}