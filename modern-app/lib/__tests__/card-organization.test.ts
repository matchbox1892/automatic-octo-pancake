import { describe, it, expect } from 'vitest';
import { CardOrganizer } from '../card-organization';
import { PlanCard } from '../plan-card-model';

describe('CardOrganizer', () => {
  describe('sortByTime', () => {
    it('should sort PTA cards first', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'vitals', time: '1000', order: 0, name: 'Vitals', timeId: 'time1', verified: false },
        { id: '2', type: 'medication', time: 'PTA', order: 1, name: 'Medication', timeId: 'time2', verified: false },
        { id: '3', type: 'assessment', time: '0900', order: 2, name: 'Assessment', timeId: 'time3', verified: false }
      ];

      const sorted = CardOrganizer.sortByTime(cards);
      expect(sorted[0].time).toBe('PTA');
      expect(sorted[1].time).toBe('0900');
      expect(sorted[2].time).toBe('1000');
    });

    it('should keep untimed cards before first timed card in original order', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'vitals', time: '', order: 0, name: 'Vitals', timeId: 'time1', verified: false },
        { id: '2', type: 'assessment', time: '', order: 1, name: 'Assessment', timeId: 'time2', verified: false },
        { id: '3', type: 'medication', time: '1000', order: 2, name: 'Medication', timeId: 'time3', verified: false },
        { id: '4', type: 'transport', time: '1100', order: 3, name: 'Transport', timeId: 'time4', verified: false }
      ];

      const sorted = CardOrganizer.sortByTime(cards);
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].time).toBe('1000');
      expect(sorted[3].time).toBe('1100');
    });

    it('should sort timed cards by time value', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'vitals', time: '1100', order: 0, name: 'Vitals', timeId: 'time1', verified: false },
        { id: '2', type: 'medication', time: '0900', order: 1, name: 'Medication', timeId: 'time2', verified: false },
        { id: '3', type: 'assessment', time: '1000', order: 2, name: 'Assessment', timeId: 'time3', verified: false }
      ];

      const sorted = CardOrganizer.sortByTime(cards);
      expect(sorted[0].time).toBe('0900');
      expect(sorted[1].time).toBe('1000'); 
      expect(sorted[2].time).toBe('1100');
    });

    it('should keep untimed cards after first timed card in original order', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'medication', time: '0900', order: 0, name: 'Medication', timeId: 'time1', verified: false },
        { id: '2', type: 'vitals', time: '', order: 1, name: 'Vitals', timeId: 'time2', verified: false },
        { id: '3', type: 'assessment', time: '', order: 2, name: 'Assessment', timeId: 'time3', verified: false },
        { id: '4', type: 'transport', time: '1000', order: 3, name: 'Transport', timeId: 'time4', verified: false }
      ];

      const sorted = CardOrganizer.sortByTime(cards);
      expect(sorted[0].time).toBe('0900');
      expect(sorted[1].time).toBe('1000');
      expect(sorted[2].id).toBe('2');
      expect(sorted[3].id).toBe('3');
    });
  });

  describe('moveCard', () => {
    it('should move card to new position and update order', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'vitals', time: '', order: 0, name: 'Vitals', timeId: 'time1', verified: false },
        { id: '2', type: 'assessment', time: '', order: 1, name: 'Assessment', timeId: 'time2', verified: false },
        { id: '3', type: 'medication', time: '', order: 2, name: 'Medication', timeId: 'time3', verified: false }
      ];

      const moved = CardOrganizer.moveCard(cards, '1', '3');
      expect(moved[0].id).toBe('2');
      expect(moved[1].id).toBe('3');
      expect(moved[2].id).toBe('1');
      expect(moved[2].order).toBe(2);
    });
  });

  describe('deleteCard', () => {
    it('should remove card and update remaining orders', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'vitals', time: '', order: 0, name: 'Vitals', timeId: 'time1', verified: false },
        { id: '2', type: 'assessment', time: '', order: 1, name: 'Assessment', timeId: 'time2', verified: false },
        { id: '3', type: 'medication', time: '', order: 2, name: 'Medication', timeId: 'time3', verified: false }
      ];

      const deleted = CardOrganizer.deleteCard(cards, '2');
      expect(deleted.length).toBe(2);
      expect(deleted[0].id).toBe('1');
      expect(deleted[1].id).toBe('3');
      expect(deleted[1].order).toBe(1);
    });
  });

  describe('updateCardPositions', () => {
    it('should update card orders based on positions', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'vitals', time: '', order: 0, name: 'Vitals', timeId: 'time1', verified: false },
        { id: '2', type: 'assessment', time: '', order: 1, name: 'Assessment', timeId: 'time2', verified: false },
        { id: '3', type: 'medication', time: '', order: 2, name: 'Medication', timeId: 'time3', verified: false }
      ];

      const positions = [
        { id: '3', order: 0 },
        { id: '1', order: 1 },
        { id: '2', order: 2 }
      ];

      const updated = CardOrganizer.updateCardPositions(cards, positions);
      expect(updated[0].order).toBe(1);
      expect(updated[1].order).toBe(2);
      expect(updated[2].order).toBe(0);
    });
  });

  describe('checkTimeOverlaps', () => {
    it('should detect overlapping times', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'vitals', time: '1000', order: 0, name: 'Vitals', timeId: 'time1', verified: false },
        { id: '2', type: 'assessment', time: '1000', order: 1, name: 'Assessment', timeId: 'time2', verified: false },
        { id: '3', type: 'medication', time: '1100', order: 2, name: 'Medication', timeId: 'time3', verified: false }
      ];

      expect(CardOrganizer.checkTimeOverlaps(cards)).toBe(true);
    });

    it('should return false for non-overlapping times', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'vitals', time: '0900', order: 0, name: 'Vitals', timeId: 'time1', verified: false },
        { id: '2', type: 'assessment', time: '1000', order: 1, name: 'Assessment', timeId: 'time2', verified: false },
        { id: '3', type: 'medication', time: '1100', order: 2, name: 'Medication', timeId: 'time3', verified: false }
      ];

      expect(CardOrganizer.checkTimeOverlaps(cards)).toBe(false);
    });

    it('should ignore PTA and untimed cards', () => {
      const cards: PlanCard[] = [
        { id: '1', type: 'vitals', time: 'PTA', order: 0, name: 'Vitals', timeId: 'time1', verified: false },
        { id: '2', type: 'assessment', time: '', order: 1, name: 'Assessment', timeId: 'time2', verified: false },
        { id: '3', type: 'medication', time: '1000', order: 2, name: 'Medication', timeId: 'time3', verified: false },
        { id: '4', type: 'transport', time: '1100', order: 3, name: 'Transport', timeId: 'time4', verified: false }
      ];

      expect(CardOrganizer.checkTimeOverlaps(cards)).toBe(false);
    });
  });
});