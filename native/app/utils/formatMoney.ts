export default function(amount: number): string {
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  };
  return `${amount / 100}$`;
}
