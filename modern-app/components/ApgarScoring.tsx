'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';

const ApgarItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  options: z.array(z.object({
    value: z.number(),
    label: z.string(),
    description: z.string(),
  })),
});

const ApgarSchema = z.object({
  time: z.string(),
  scores: z.record(z.number()),
  total: z.number(),
});

type ApgarItem = z.infer<typeof ApgarItemSchema>;
type ApgarScore = z.infer<typeof ApgarSchema>;

const APGAR_ITEMS: ApgarItem[] = [
  {
    id: 'appearance',
    label: 'Appearance (Color)',
    options: [
      { value: 0, label: 'Blue/Pale', description: 'Body and extremities blue or pale' },
      { value: 1, label: 'Pink Body/Blue Extremities', description: 'Good color in body but extremities blue' },
      { value: 2, label: 'Completely Pink', description: 'Good color all over' },
    ],
  },
  {
    id: 'pulse',
    label: 'Pulse (Heart Rate)',
    options: [
      { value: 0, label: 'Absent', description: 'No heart rate' },
      { value: 1, label: 'Slow', description: 'Less than 100 beats per minute' },
      { value: 2, label: 'Normal', description: 'At least 100 beats per minute' },
    ],
  },
  {
    id: 'grimace',
    label: 'Grimace (Reflex Response)',
    options: [
      { value: 0, label: 'No Response', description: 'No response to stimulation' },
      { value: 1, label: 'Grimace', description: 'Grimace with stimulation' },
      { value: 2, label: 'Cough or Sneeze', description: 'Cry or pull away with stimulation' },
    ],
  },
  {
    id: 'activity',
    label: 'Activity (Muscle Tone)',
    options: [
      { value: 0, label: 'Limp', description: 'No movement, limp' },
      { value: 1, label: 'Some Flexion', description: 'Some flexion of extremities' },
      { value: 2, label: 'Active Motion', description: 'Active motion' },
    ],
  },
  {
    id: 'respiration',
    label: 'Respiration',
    options: [
      { value: 0, label: 'Absent', description: 'No breathing' },
      { value: 1, label: 'Weak', description: 'Slow, irregular breathing' },
      { value: 2, label: 'Good Cry', description: 'Good, strong cry' },
    ],
  },
];

type ApgarScoringProps = {
  initialValue?: ApgarScore;
  onChange?: (score: ApgarScore) => void;
  time: '1min' | '5min' | '10min';
};

export function ApgarScoring({ initialValue, onChange, time }: ApgarScoringProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    initialValue?.scores || APGAR_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );

  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

  useEffect(() => {
    onChange?.({
      time,
      scores,
      total,
    });
  }, [scores, time, onChange]);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">APGAR Score - {time}</h3>
        <div className="text-xl font-bold">Total: {total}</div>
      </div>
      <div className="space-y-3">
        {APGAR_ITEMS.map((item) => (
          <div key={item.id} className="space-y-2">
            <label className="block text-sm font-medium">{item.label}</label>
            <div className="flex gap-4">
              {item.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setScores((prev) => ({ ...prev, [item.id]: option.value }))}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    scores[item.id] === option.value
                      ? 'bg-blue-100 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                  title={option.description}
                >
                  {option.value}: {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}