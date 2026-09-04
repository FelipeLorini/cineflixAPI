import { useCallback, useEffect, useState } from "react";

/**
 * Estado persistido no localStorage.
 * A leitura acontece após a hidratação para evitar divergência entre servidor e cliente.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* dados corrompidos: mantém o valor inicial */
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* cota excedida: ignora */
    }
  }, [key, value, loaded]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return { value, setValue, loaded, reset };
}
