import { DefaultTheme, DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    accent: '#03DAC6',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    onSurface: '#000000',
    disabled: '#757575',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#f50057',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#90CAF9',
    accent: '#03DAC6',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    onSurface: '#ffffff',
    disabled: '#757575',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#f50057',
  },
};

export const getTheme = (isDark = false) => {
  return isDark ? darkTheme : lightTheme;
};

// Funções utilitárias
export const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
};

export const formatNumber = (value) => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercentage = (value) => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  return `${value.toFixed(2)}%`;
};
