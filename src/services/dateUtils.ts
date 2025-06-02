// src/services/dateUtils.ts (exemplo de onde colocar)
export const getDayKey = (date: Date): string => {
  // Formato YYYY-MM-DD para garantir que datas no mesmo dia sejam agrupadas,
  // independentemente da hora.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são 0-indexados
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// src/services/arrayUtils.ts (exemplo de onde colocar)
export function groupBy<T, K extends string | number | symbol>(
  list: T[],
  keyGetter: (input: T) => K
): Record<K, T[]> {
  const map = {} as Record<K, T[]>;
  list.forEach((item) => {
    const key = keyGetter(item);
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(item);
  });
  return map;
}