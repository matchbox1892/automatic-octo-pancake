'use client';

import { useState, useCallback } from 'react';
import type { PlanCard, PlanCardTemplate, PlanCardTime } from '@/lib/plan-card-model';
import { formatCounter, sortPlanCards, fixTimeOverlap } from '@/lib/plan-card-model';
import { DroppablePlanCard } from './DroppablePlanCard';

interface PlanCardContainerProps {
  templates: PlanCardTemplate[];
  onChange?: (cards: PlanCard[]) => void;
}

export function PlanCardContainer({ templates, onChange }: PlanCardContainerProps) {
  const [state, setState] = useState<{
    cards: PlanCard[];
    runningCount: number;
    visibleCount: number;
  }>({
    cards: [],
    runningCount: 0,
    visibleCount: 0
  });

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const addCard = useCallback((template: PlanCardTemplate) => {
    const counter = state.runningCount + 1;
    const counterId = formatCounter(counter);
    const newId = `${template.id}${counterId}`;
    const timeId = `time_${newId}`;

    const newCard: PlanCard = {
      id: newId,
      name: template.name,
      type: template.id,
      timeId,
      order: state.cards.length,
      time: '',
      verified: false
    };

    setState(prev => {
      const newCards = sortPlanCards([...prev.cards, newCard]);
      const fixedCards = fixTimeOverlap(newCards);
      onChange?.(fixedCards);
      
      return {
        cards: fixedCards,
        runningCount: counter,
        visibleCount: fixedCards.length
      };
    });

    // Auto-expand newly added cards
    setExpandedCards(prev => new Set([...prev, newId]));
  }, [state.runningCount, state.cards, onChange]);

  const removeCard = useCallback((cardId: string) => {
    setState(prev => {
      const newCards = prev.cards.filter(card => card.id !== cardId);
      onChange?.(newCards);
      
      return {
        ...prev,
        cards: newCards,
        visibleCount: newCards.length
      };
    });
    
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.delete(cardId);
      return next;
    });
  }, [onChange]);

  const updateCardTime = useCallback((cardId: string, time: PlanCardTime) => {
    setState(prev => {
      const cardIndex = prev.cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return prev;

      const newCards = [...prev.cards];
      newCards[cardIndex] = { ...newCards[cardIndex], time };
      
      const sortedCards = sortPlanCards(newCards);
      const fixedCards = fixTimeOverlap(sortedCards);
      onChange?.(fixedCards);

      return {
        ...prev,
        cards: fixedCards
      };
    });
  }, [onChange]);

  const handleDragStart = useCallback((cardId: string) => {
    setDraggingId(cardId);
  }, []);

  const handleDrop = useCallback((sourceId: string, targetId: string) => {
    setState(prev => {
      const sourceIndex = prev.cards.findIndex(card => card.id === sourceId);
      const targetIndex = prev.cards.findIndex(card => card.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const newCards = [...prev.cards];
      const [movedCard] = newCards.splice(sourceIndex, 1);
      newCards.splice(targetIndex, 0, movedCard);

      const reorderedCards = newCards.map((card, index) => ({
        ...card,
        order: index
      }));

      onChange?.(reorderedCards);

      return {
        ...prev,
        cards: reorderedCards
      };
    });
  }, [onChange]);

  const handleExpandAll = useCallback(() => {
    setExpandedCards(new Set(state.cards.map(card => card.id)));
  }, [state.cards]);

  const handleCollapseAll = useCallback(() => {
    setExpandedCards(new Set());
  }, []);

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="flex flex-wrap gap-2">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => addCard(template)}
            className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            Add {template.name}
          </button>
        ))}
      </div>

      {/* Card Controls */}
      {state.visibleCount > 0 && (
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
          <div className="flex space-x-4">
            <button
              onClick={handleCollapseAll}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Collapse All
            </button>
            <button
              onClick={handleExpandAll}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Expand All
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {state.visibleCount} card{state.visibleCount !== 1 ? 's' : ''} in plan
            </span>
            <button
              onClick={() => setState({ cards: [], runningCount: 0, visibleCount: 0 })}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Card List */}
      <div className="space-y-4">
        {state.cards.map(card => {
          const template = templates.find(t => t.id === card.type);
          if (!template) return null;

          return (
            <DroppablePlanCard
              key={card.id}
              card={card}
              template={template}
              isExpanded={expandedCards.has(card.id)}
              onTimeChange={(time) => updateCardTime(card.id, time)}
              onRemove={() => removeCard(card.id)}
              onToggleExpand={() => {
                setExpandedCards(prev => {
                  const next = new Set(prev);
                  if (next.has(card.id)) {
                    next.delete(card.id);
                  } else {
                    next.add(card.id);
                  }
                  return next;
                });
              }}
              onDragStart={(e) => {
                e.dataTransfer.setData('cardId', card.id);
                handleDragStart(card.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const sourceId = e.dataTransfer.getData('cardId');
                if (sourceId && sourceId !== card.id) {
                  handleDrop(sourceId, card.id);
                }
                setDraggingId(null);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}