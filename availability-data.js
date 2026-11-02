(() => {
  const key = 'yokogawa-availability-v1';
  const seed = [
    '2026-01-03', '2026-01-11', '2026-01-12', '2026-01-13', '2026-01-14',
    '2026-02-04', '2026-02-05', '2026-02-06', '2026-02-18',
    '2026-03-10', '2026-03-11', '2026-03-12', '2026-03-24', '2026-03-25',
    '2026-05-05', '2026-05-06', '2026-05-07', '2026-05-20',
    '2026-06-09', '2026-06-10', '2026-06-23', '2026-06-24', '2026-06-25',
    '2026-07-07', '2026-07-08', '2026-07-09', '2026-07-21',
    '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-22', '2026-09-23',
    '2026-10-06', '2026-10-07', '2026-10-20', '2026-10-21', '2026-10-22',
    '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-17',
  ];
  const valid = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  window.YokogawaAvailability = {
    valid,
    read() {
      const raw = localStorage.getItem(key);
      if (raw === null) return [...seed];
      const dates = JSON.parse(raw);
      if (!Array.isArray(dates) || !dates.every(valid)) throw new Error('Invalid availability data');
      return [...new Set(dates)].sort();
    },
    save(dates) { localStorage.setItem(key, JSON.stringify([...new Set(dates)].sort())); }
  };
})();
