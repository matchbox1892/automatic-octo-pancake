type AgeUnit = 'years' | 'months' | 'days';

type AgeResult = {
  value: number;
  unit: AgeUnit;
};

export function calculateAge(birthDate: Date): AgeResult {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    throw new Error('Invalid birth date');
  }

  const today = new Date();
  if (birthDate > today) {
    throw new Error('Birth date cannot be in the future');
  }

  // Years calculation
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Adjust for negative months/days
  if (months < 0) {
    years--;
    months += 12;
  }
  if (days < 0) {
    months--;
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += lastDayOfMonth;
  }

  // Return appropriate unit based on age
  if (years > 0) {
    return { value: years, unit: 'years' };
  }
  
  if (months > 0) {
    return { value: months, unit: 'months' };
  }

  return { value: days > 0 ? days : 1, unit: 'days' };
}

export function formatAge({ value, unit }: AgeResult): string {
  const unitMapping = {
    years: 'year old',
    months: 'month old',
    days: 'day old'
  };

  return `${value} ${unitMapping[unit]}`;
}