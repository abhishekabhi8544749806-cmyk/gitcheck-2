import { useEffect, useState } from 'react';

// Chart colors per mode. Recharts writes SVG attributes, so charts take hex
// values from here rather than CSS variables. Keep in sync with index.css.
export const palette = {
  light: {
    series: ['#2a78d6', '#eb6834', '#1baf7a'],
    grid: '#e1e0d9',
    axis: '#c3c2b7',
    muted: '#898781',
    surface: '#fcfcfb',
  },
  dark: {
    series: ['#3987e5', '#d95926', '#199e70'],
    grid: '#2c2c2a',
    axis: '#383835',
    muted: '#898781',
    surface: '#1a1a19',
  },
};

const STORAGE_KEY = 'dashboard-theme';

function systemMode() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// Returns the resolved mode ('light' | 'dark') and a toggle. An explicit choice
// is stored and stamped on <html data-theme>; otherwise the OS setting is followed.
export function useTheme() {
  const [choice, setChoice] = useState(readStored);
  const [system, setSystem] = useState(systemMode);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = () => setSystem(systemMode());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (choice) document.documentElement.dataset.theme = choice;
    else delete document.documentElement.dataset.theme;
  }, [choice]);

  const mode = choice ?? system;

  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setChoice(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable; the choice still applies for this session
    }
  };

  return { mode, colors: palette[mode], toggle };
}
