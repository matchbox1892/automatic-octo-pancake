import React, { useState } from 'react';
import type { PlanCard, PlanCardTemplate, PlanCardTime } from '@/lib/plan-card-model';

interface DroppablePlanCardProps {
  card: PlanCard;
  template: PlanCardTemplate;
  isExpanded: boolean;
  onTimeChange: (time: PlanCardTime) => void;
  onRemove: () => void;
  onToggleExpand: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function DroppablePlanCard({
  card,
  template,
  isExpanded,
  onTimeChange,
  onRemove,
  onToggleExpand,
  onDragStart,
  onDragOver,
  onDrop
}: DroppablePlanCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const Template = template.component;

  return (
    <>
      <div 
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="bg-white rounded-lg shadow"
      >
        <div className="p-4 flex items-center justify-between bg-gray-50">
          <div className="flex-1 flex items-center space-x-4">
            <button
              onClick={onToggleExpand}
              className="text-blue-600 hover:text-blue-800"
              aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
            >
              <span className="text-xl">{isExpanded ? '▼' : '▶'}</span>
            </button>
            <h3 className="font-semibold">{card.name}</h3>
            <input
              type="text"
              value={card.time}
              onChange={e => onTimeChange(e.target.value as PlanCardTime)}
              placeholder="Time (PTA or HHMM)"
              className="px-2 py-1 border rounded w-32"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>

        {isExpanded && Template && (
          <div className="p-4 border-t">
            <Template
              id={card.id}
              time={card.time}
              onTimeChange={onTimeChange}
              onRemove={onRemove}
            />
          </div>
        )}
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="font-semibold mb-4">Delete Card</h4>
            <p>Are you sure you want to delete this {card.name} card?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRemove();
                  setShowDeleteDialog(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}