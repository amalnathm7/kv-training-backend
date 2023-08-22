export function compareDateMonts(higherDate: Date, lowerDate: Date, minMonthDifference: number): boolean {
      const yearsDiff = higherDate.getFullYear() - lowerDate.getFullYear();
      const monthsDiff = higherDate.getMonth() - lowerDate.getMonth();
      const totalMonthsDiff = yearsDiff * 12 + monthsDiff;
    
      return totalMonthsDiff >= minMonthDifference;
}