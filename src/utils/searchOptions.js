function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .replace('ё', 'е')
    .trim();
}

export async function searchOptions({
  query,
  localOptions = [],
  // Если apiUrl задан — попробуем сходить в API. Если нет — работаем локально.
  apiUrl,
  // имя query-параметра (на случай если будет q / query / search)
  queryParam = 'q',
  // ограничение результатов
  limit = 50,
  // как из ответа достать массив (на случай разных форматов)
  mapResponse,
  // fetch init (headers/auth etc.)
  fetchInit,
}) {
  const q = normalize(query);

  // Правило из твоего UI: искать начинаем от 2 букв
  if (q.length < 2) {
    return {
      items: localOptions.slice(0, limit),
      source: 'local',
    };
  }

  // 1) Пробуем API, если задан
  if (apiUrl) {
    try {
      const url = new URL(apiUrl, window.location.origin);
      url.searchParams.set(queryParam, q);
      url.searchParams.set('limit', String(limit));

      const res = await fetch(url.toString(), {
        method: 'GET',
        ...fetchInit,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // Универсально: либо mapResponse, либо пробуем угадать
      let items;
      if (typeof mapResponse === 'function') {
        items = mapResponse(data);
      } else if (Array.isArray(data)) {
        items = data;
      } else if (Array.isArray(data?.items)) {
        items = data.items;
      } else if (Array.isArray(data?.data)) {
        items = data.data;
      } else {
        items = [];
      }

      // Нормализуем к строкам/объектам
      items = (items || []).slice(0, limit);

      return { items, source: 'api' };
    } catch (e) {
      // если API упал — тихо фоллбэк на локальный
      // (это удобно на этапе разработки)
    }
  }

  // 2) Локальный поиск (фоллбэк или основной режим)
  const filtered = localOptions
    .filter((opt) => normalize(typeof opt === 'string' ? opt : opt?.label).includes(q))
    .slice(0, limit);

  return { items: filtered, source: 'local' };
}
