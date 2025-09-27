import { BasePlanCard } from './schemas/card-schema';
import { CardTemplates } from './card-templates';

type NarrativeFormat = 'PCR' | 'CHART';
type WordType = 'FIRST' | 'WORD' | 'SENTENCE';

interface NarrativeOptions {
  format: NarrativeFormat;
  includeTime?: boolean;
  includeVerification?: boolean;
}

export class NarrativeGenerator {
  private prevWordType: WordType = 'FIRST';
  private narrative: string = '';

  constructor(private options: NarrativeOptions) {}

  private formatTime(time: string): string {
    if (!time || !this.options.includeTime) return '';
    if (/^([Pp][Tt][Aa])/.test(time)) return 'Prior to arrival, ';
    return `At ${time}, `;
  }

  private addSeparator(): string {
    switch (this.prevWordType) {
      case 'FIRST':
        return '';
      case 'WORD':
        return ' ';
      case 'SENTENCE':
        return '. ';
      default:
        return ' ';
    }
  }

  private formatVerification(card: BasePlanCard): string {
    if (!this.options.includeVerification || !card.verification.verified) {
      return '';
    }
    return ` (verified by ${card.verification.verifiedBy || 'provider'})`;
  }

  // Template system for generating narratives based on card type
  private generateCardNarrative(card: BasePlanCard, template: string): string {
    // Replace template variables with actual values
    let narrative = template;
    
    // Add time prefix if needed
    if (this.options.includeTime) {
      narrative = this.formatTime(card.time) + narrative;
    }

    // Add verification if needed
    if (this.options.includeVerification) {
      narrative += this.formatVerification(card);
    }

    return narrative;
  }

  // Process multiple cards and generate a complete narrative
  generateNarrative(cards: BasePlanCard[]): string {
    this.narrative = '';
    this.prevWordType = 'FIRST';

    // Sort cards by order
    const sortedCards = [...cards].sort((a, b) => a.order - b.order);

    sortedCards.forEach(card => {
      // Get the appropriate template for this card type
      const template = this.getTemplateForCard(card);
      if (!template) return;

      // Add appropriate separator
      this.narrative += this.addSeparator();

      // Generate and add the card's narrative
      const cardNarrative = this.generateCardNarrative(card, template);
      this.narrative += cardNarrative;

      // Update previous word type
      this.prevWordType = cardNarrative.endsWith('.') ? 'SENTENCE' : 'WORD';
    });

    // Ensure narrative ends with a period
    if (!this.narrative.endsWith('.')) {
      this.narrative += '.';
    }

    return this.narrative.trim();
  }

  private getTemplateForCard(card: BasePlanCard): string {
    const template = CardTemplates[card.type];
    if (!template) return '';

    let narrativeTemplate = template[this.options.format];
    
    // Replace template variables with actual values
    if (template.formatData) {
      const data = template.formatData(card);
      Object.entries(data).forEach(([key, value]) => {
        narrativeTemplate = narrativeTemplate.replace(`{${key}}`, value);
      });
    }

    return narrativeTemplate;
  }
}