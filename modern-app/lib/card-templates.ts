import type { BasePlanCard } from './schemas/card-schema';
import type { 
  ResponseCard, 
  GCSCard, 
  O2Card, 
  IVCard, 
  MedicationCard 
} from './schemas/specialized-cards';

type CardTemplate = {
  PCR: string;
  CHART: string;
  formatData?: (card: BasePlanCard) => Record<string, string>;
};

// Function to format narrative data for each card type
const formatResponseData = (card: ResponseCard) => ({
  responseType: card.details.responseType.toLowerCase(),
  responseCode: card.details.responseCode ? ` ${card.details.responseCode}` : '',
  location: card.details.location,
});

const formatGCSData = (card: GCSCard) => ({
  total: card.details.total.toString(),
  breakdown: `E${card.details.eyes}V${card.details.verbal}M${card.details.motor}`,
  pupils: `pupils ${card.details.pupilLeft.toLowerCase()}/${card.details.pupilRight.toLowerCase()}`,
});

const formatO2Data = (card: O2Card) => ({
  method: card.details.method,
  flowRate: `${card.details.flowRate}LPM`,
  spo2Change: card.details.spO2Before && card.details.spO2After 
    ? `improving SpO2 from ${card.details.spO2Before}% to ${card.details.spO2After}%`
    : '',
});

const formatIVData = (card: IVCard) => ({
  site: card.details.site,
  gauge: card.details.size,
  fluid: card.details.fluid,
  rate: card.details.rate,
  volume: card.details.totalVolume ? ` with ${card.details.totalVolume}mL infused` : '',
});

const formatMedicationData = (card: MedicationCard) => ({
  medication: card.details.medication,
  dose: card.details.dose,
  route: card.details.route,
  indication: card.details.indication,
  response: card.details.response ? ` with ${card.details.response} response` : '',
});

// Card narrative templates
export const CardTemplates: Record<string, CardTemplate> = {
  response: {
    PCR: 'responded {responseType}{responseCode} to {location}',
    CHART: 'EMS response {responseType}{responseCode} to {location}',
    formatData: formatResponseData as any,
  },

  gcs: {
    PCR: 'GCS {total} ({breakdown}), {pupils}',
    CHART: 'Glasgow Coma Scale assessed at {total} ({breakdown}), {pupils}',
    formatData: formatGCSData as any,
  },

  o2: {
    PCR: 'administered oxygen via {method} at {flowRate}{spo2Change}',
    CHART: 'O2 therapy initiated with {method} at {flowRate}{spo2Change}',
    formatData: formatO2Data as any,
  },

  iv: {
    PCR: 'established {gauge} IV access in {site}, {fluid} at {rate}{volume}',
    CHART: 'IV access obtained: {gauge} in {site}, infusing {fluid} at {rate}{volume}',
    formatData: formatIVData as any,
  },

  medication: {
    PCR: 'administered {medication} {dose} {route} for {indication}{response}',
    CHART: 'Medication given: {medication} {dose} {route} for {indication}{response}',
    formatData: formatMedicationData as any,
  },

  vitals: {
    PCR: 'vital signs assessed: {values}',
    CHART: 'Vital signs obtained: {values}',
  },

  exam: {
    PCR: 'physical assessment revealed {findings}',
    CHART: 'Physical exam: {findings}',
  },

  cpr: {
    PCR: 'initiated CPR {details}',
    CHART: 'Resuscitation efforts: {details}',
  },

  arrival: {
    PCR: 'arrived on scene {details}',
    CHART: 'EMS arrival on scene {details}',
  },
};