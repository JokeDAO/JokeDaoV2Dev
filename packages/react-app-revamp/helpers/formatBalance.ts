export function formatBalance(balance: string) {
  const num = parseFloat(balance);

  // Check if the number is very small and if it is, display it up to the last significant digit
  if (num > 0 && num < 0.01) {
    // Find the position of the first non zero digit after the decimal
    const afterDecimal = balance.split(".")[1];
    let position = 0;
    for (let digit of afterDecimal) {
      position++;
      if (digit !== "0") break;
    }
    // Show all digits up to an dincluding the first non-zero digit
    return num.toFixed(position);
  }

  // Otherwise, truncate to at most 2 decimal places without rounding.
  return Math.floor(num * 100) / 100;
}
