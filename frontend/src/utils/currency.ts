/**
 * Currency display helpers: normalize GBP to pound symbol (£) across the app.
 * Backend continues to use 'GBP'; frontend displays £ for prices.
 */

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
  CAD: 'C$',
};

/** Normalize currency code/symbol for display (e.g. GBP or gbp -> £). */
export function getCurrencyDisplaySymbol(currency: string | null | undefined): string {
  if (!currency) return '£';
  const code = currency.toUpperCase();
  if (code === '£') return '£';
  return CURRENCY_SYMBOLS[code] ?? currency;
}

/** Format price for display: e.g. £50 (no space, symbol first). */
export function formatPriceDisplay(
  currency: string | null | undefined,
  price: number | string | null | undefined
): string {
  const symbol = getCurrencyDisplaySymbol(currency);
  if (price == null || price === '') return symbol + '0';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (Number.isNaN(num)) return symbol + '0';
  return symbol + num.toLocaleString();
}

/** Currency code to send to API (e.g. £ -> GBP). */
export function toApiCurrency(displayCurrency: string): string {
  if (displayCurrency === '£') return 'GBP';
  const u = displayCurrency.toUpperCase();
  return CURRENCY_SYMBOLS[u] ? u : displayCurrency;
}

/** Format request price range label for display: "Less than 10 GBP" -> "Less than £10". */
export function formatRequestPriceRangeLabel(range: string): string {
  if (!range) return range;
  return range
    .replace(/\b(\d+)\s*~\s*(\d+)\s*GBP\b/gi, '£$1 ~ £$2')
    .replace(/\b(\d+)\s*-\s*(\d+)\s*GBP\b/gi, '£$1 - £$2')
    .replace(/\bLess than (\d+) GBP\b/gi, 'Less than £$1')
    .replace(/\bMore than (\d+) GBP\b/gi, 'More than £$1');
}
