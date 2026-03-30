import { useState, useEffect } from 'react';

// Caches to prevent refetching during re-renders or navigation
let globalCurrency = '';
let globalRates: Record<string, number> | null = null;
let fetchPromise: Promise<void> | null = null;

export function usePricing() {
  const [currency, setCurrency] = useState<string>(globalCurrency || 'USD');
  const [rates, setRates] = useState<Record<string, number> | null>(globalRates);

  useEffect(() => {
    if (globalRates && globalCurrency) return;
    if (fetchPromise) {
      fetchPromise.then(() => {
        setCurrency(globalCurrency);
        setRates(globalRates);
      });
      return;
    }

    const loadData = async () => {
      try {
        const ipRes = await fetch('https://ipapi.co/currency/');
        const localCurrency = await ipRes.text();
        
        const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
        const rateData = await rateRes.json();

        if (localCurrency && rateData.rates) {
          globalCurrency = localCurrency.trim();
          globalRates = rateData.rates;
          
          setCurrency(globalCurrency);
          setRates(globalRates);
        }
      } catch (err) {
        console.warn('Silent fail on pricing localization, defaulting to USD', err);
        globalCurrency = 'USD';
        globalRates = { USD: 1 };
        setCurrency(globalCurrency);
        setRates(globalRates);
      }
    };

    fetchPromise = loadData();
  }, []);

  const formatPrice = (basePriceUSD: number) => {
    const multiplier = rates ? (rates[currency] || 1) : 1;
    const targetPrice = basePriceUSD * multiplier;

    try {
      return new Intl.NumberFormat(navigator.language || 'en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
      }).format(targetPrice);
    } catch (e) {
      return `$${targetPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  return { formatPrice, currency };
}
