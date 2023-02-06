import { useEffect, useState } from "react";

export function useLocalStorage(key: string, initialValue: string | null) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(localStorage.getItem(key));
  }, []);

  useEffect(() => {
    console.log(value);
    if (value) {
      localStorage.setItem(key, value);
    }
    console.log(value);
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}
