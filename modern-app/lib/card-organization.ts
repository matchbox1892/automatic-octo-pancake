import { PlanCard } from './plan-card-model';

/**
 * Compare function for sorting cards by time
 */
function compareCardTimes(a: PlanCard, b: PlanCard): number {
  // PTA cards always come first
  if (a.time === 'PTA' && b.time !== 'PTA') return -1;
  if (a.time !== 'PTA' && b.time === 'PTA') return 1;
  if (a.time === 'PTA' && b.time === 'PTA') return 0;

  // Cards without times get split into two groups:
  // 1. Those that appear before the first timed card
  // 2. Those that appear after the first timed card 
  const aHasTime = Boolean(a.time && a.time !== 'PTA');
  const bHasTime = Boolean(b.time && b.time !== 'PTA');

  // If neither card has a time, preserve their relative order
  if (!aHasTime && !bHasTime) {
    return 0;
  }

  // Timed cards get sorted by their numeric time value
  if (aHasTime && bHasTime) {
    return parseInt(a.time || '0') - parseInt(b.time || '0');
  }

  // Cards without times stay in their relative positions
  // before or after timed cards based on their original order
  return 0;
}

interface CardPosition {
  id: string;
  order: number;
}

/**
 * Manages card organization including sorting and reordering
 */
export class CardOrganizer {
  /**
   * Sort cards by time, preserving relative order of untimed cards
   */
  static sortByTime(cards: PlanCard[]): PlanCard[] {
    const firstTimedCard = cards.find(card => card.time && card.time !== 'PTA');
    const firstTimedCardIndex = firstTimedCard ? cards.indexOf(firstTimedCard) : -1;

    // Split into groups:
    // 1. PTA cards
    // 2. Untimed cards before first timed card 
    // 3. Timed cards
    // 4. Untimed cards after first timed card
    const ptaCards: PlanCard[] = [];
    const untimedBeforeCards: PlanCard[] = [];
    const timedCards: PlanCard[] = [];
    const untimedAfterCards: PlanCard[] = [];

    cards.forEach((card, index) => {
      if (card.time === 'PTA') {
        ptaCards.push(card);
      } else if (!card.time) {
        if (firstTimedCardIndex === -1 || index < firstTimedCardIndex) {
          untimedBeforeCards.push(card);
        } else {
          untimedAfterCards.push(card);
        }
      } else {
        timedCards.push(card);
      }
    });

    // Sort timed cards by time
    timedCards.sort((a, b) => parseInt(a.time || '0') - parseInt(b.time || '0'));

    // Combine groups in correct order
    return [
      ...ptaCards,
      ...untimedBeforeCards,
      ...timedCards,
      ...untimedAfterCards
    ];
  }

  /**
   * Move a card to a new position, updating order of all affected cards
   */
  static moveCard(cards: PlanCard[], sourceId: string, targetId: string): PlanCard[] {
    const result = [...cards];
    const sourceIndex = result.findIndex(card => card.id === sourceId);
    const targetIndex = result.findIndex(card => card.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      return cards;
    }

    const [movedCard] = result.splice(sourceIndex, 1);
    result.splice(targetIndex, 0, movedCard);

    // Update order properties
    return result.map((card, index) => ({
      ...card,
      order: index
    }));
  }

  /**
   * Delete a card by ID
   */
  static deleteCard(cards: PlanCard[], cardId: string): PlanCard[] {
    return cards
      .filter(card => card.id !== cardId)
      .map((card, index) => ({
        ...card,
        order: index
      }));
  }

  /**
   * Get card positions for drag and drop reordering
   */
  static getCardPositions(cards: PlanCard[]): CardPosition[] {
    return cards.map(card => ({
      id: card.id,
      order: card.order
    }));
  }

  /**
   * Update card positions after drag and drop
   */
  static updateCardPositions(cards: PlanCard[], positions: CardPosition[]): PlanCard[] {
    const positionMap = new Map(positions.map(p => [p.id, p.order]));
    
    return cards.map(card => ({
      ...card,
      order: positionMap.get(card.id) ?? card.order
    }));
  }

  /**
   * Check for time overlaps between cards
   */
  static checkTimeOverlaps(cards: PlanCard[]): boolean {
    const timedCards = cards
      .filter(card => card.time && card.time !== 'PTA')
      .sort((a, b) => parseInt(a.time || '0') - parseInt(b.time || '0'));

    for (let i = 0; i < timedCards.length - 1; i++) {
      if (timedCards[i].time === timedCards[i + 1].time) {
        return true;
      }
    }

    return false;
  }
}