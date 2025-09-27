'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export type ThreeStateValue = 0 | 1 | 2; // none, minus, plus

type ThreeStateCheckboxProps = {
  value?: ThreeStateValue;
  onChange?: (value: ThreeStateValue) => void;
  label: string;
  disabled?: boolean;
  description?: string;
  textInput?: boolean;
};

const stateToImage = {
  0: '/images/3stage1.svg',
  1: '/images/3stage2.svg',
  2: '/images/3stage3.svg',
};

const stateToAlt = {
  0: '☐', // empty box
  1: '⊟', // minus
  2: '⊞', // plus
};

export function ThreeStateCheckbox({
  value = 0,
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
    
    const nextState = ((localState + 1) % 3) as ThreeStateValue;
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