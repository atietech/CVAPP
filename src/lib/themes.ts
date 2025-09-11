
export type Theme = {
  name: string;
  light: {
    background: string;
    foreground: string;
    card: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  dark: {
    background: string;
    foreground: string;
    card: string;
    primary: string;
    secondary: string;
    accent: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'default',
    light: {
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      primary: '217 91% 60%',
      secondary: '210 40% 96.1%',
      accent: '217 91% 60%',
    },
    dark: {
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
      card: '222.2 84% 4.9%',
      primary: '217 91% 65%',
      secondary: '217.2 32.6% 17.5%',
      accent: '217 91% 65%',
    }
  },
  {
    name: 'zinc',
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      card: '0 0% 100%',
      primary: '240 5.9% 10%',
      secondary: '240 4.8% 95.9%',
      accent: '240 5.9% 10%',
    },
    dark: {
      background: '240 10% 3.9%',
      foreground: '240 5% 95%',
      card: '240 10% 3.9%',
      primary: '240 5% 95%',
      secondary: '240 3.7% 15.9%',
      accent: '240 5% 95%',
    },
  },
  {
    name: 'rose',
    light: {
      background: '0 0% 100%',
      foreground: '346.8 77.2% 49.8%',
      card: '0 0% 100%',
      primary: '346.8 77.2% 49.8%',
      secondary: '345 100% 97.3%',
      accent: '346.8 77.2% 49.8%',
    },
    dark: {
      background: '333.3 64.3% 6.9%',
      foreground: '345 100% 97.3%',
      card: '333.3 64.3% 6.9%',
      primary: '340.9 95.1% 83.5%',
      secondary: '330 50% 12%',
      accent: '340.9 95.1% 83.5%',
    },
  },
  {
    name: 'green',
    light: {
      background: '142.1 76.2% 96.3%',
      foreground: '142.1 70.6% 25.1%',
      card: '142.1 76.2% 96.3%',
      primary: '142.1 76.2% 36.3%',
      secondary: '142.1 70.6% 90.1%',
      accent: '142.1 76.2% 36.3%',
    },
    dark: {
      background: '142.1 70.6% 15.1%',
      foreground: '142.1 70.6% 95.1%',
      card: '142.1 70.6% 15.1%',
      primary: '142.1 70.6% 45.1%',
      secondary: '142.1 70.6% 20.1%',
      accent: '142.1 70.6% 45.1%',
    },
  },
  {
    name: 'orange',
    light: {
      background: '24.6 95% 97.3%',
      foreground: '24.6 95% 42.4%',
      card: '24.6 95% 97.3%',
      primary: '24.6 95% 53.1%',
      secondary: '24.6 95% 92.3%',
      accent: '24.6 95% 53.1%',
    },
    dark: {
      background: '20.5 90.2% 10.8%',
      foreground: '20.5 90.2% 97.8%',
      card: '20.5 90.2% 10.8%',
      primary: '20.5 90.2% 48.2%',
      secondary: '20.5 90.2% 15.8%',
      accent: '20.5 90.2% 48.2%',
    },
  },
  {
    name: 'violet',
    light: {
      background: '262.1 83.3% 97.8%',
      foreground: '262.1 83.3% 42.2%',
      card: '262.1 83.3% 97.8%',
      primary: '262.1 83.3% 57.8%',
      secondary: '262.1 83.3% 92.8%',
      accent: '262.1 83.3% 57.8%',
    },
    dark: {
      background: '263.4 70% 10.4%',
      foreground: '263.4 70% 97.4%',
      card: '263.4 70% 10.4%',
      primary: '263.4 70% 50.4%',
      secondary: '263.4 70% 15.4%',
      accent: '263.4 70% 50.4%',
    },
  },
  {
    name: 'slate',
    light: {
      background: '215.2 27.9% 95.1%',
      foreground: '215.4 16.3% 26.9%',
      card: '215.2 27.9% 95.1%',
      primary: '221.2 83.2% 53.3%',
      secondary: '215.3 25.4% 90.2%',
      accent: '221.2 83.2% 53.3%',
    },
    dark: {
      background: '222.2 47.4% 11.2%',
      foreground: '210 40% 98%',
      card: '222.2 47.4% 11.2%',
      primary: '217.2 91.2% 59.8%',
      secondary: '217.2 32.6% 17.5%',
      accent: '217.2 91.2% 59.8%',
    },
  },
  {
    name: 'stone',
    light: {
        background: "0 0% 100%",
        foreground: "240 10% 3.9%",
        card: "0 0% 100%",
        primary: "240 5.9% 10%",
        secondary: "240 4.8% 95.9%",
        accent: "240 5.9% 10%",
    },
    dark: {
        background: "240 10% 3.9%",
        foreground: "240 5% 95%",
        card: "240 10% 3.9%",
        primary: "240 5% 95%",
        secondary: "240 3.7% 15.9%",
        accent: "240 5% 95%",
    }
  },
  {
    name: 'neutral',
    light: {
        background: "0 0% 100%",
        foreground: "240 10% 3.9%",
        card: "0 0% 100%",
        primary: "240 5.9% 10%",
        secondary: "240 4.8% 95.9%",
        accent: "240 5.9% 10%",
    },
    dark: {
        background: "240 10% 3.9%",
        foreground: "240 5% 95%",
        card: "240 10% 3.9%",
        primary: "240 5% 95%",
        secondary: "240 3.7% 15.9%",
        accent: "240 5% 95%",
    }
  },
  {
    name: 'gray',
    light: {
        background: "0 0% 100%",
        foreground: "240 10% 3.9%",
        card: "0 0% 100%",
        primary: "240 5.9% 10%",
        secondary: "240 4.8% 95.9%",
        accent: "240 5.9% 10%",
    },
    dark: {
        background: "240 10% 3.9%",
        foreground: "240 5% 95%",
        card: "240 10% 3.9%",
        primary: "240 5% 95%",
        secondary: "240 3.7% 15.9%",
        accent: "240 5% 95%",
    }
  },
  {
    name: 'red',
    light: {
        background: "0 0% 100%",
        foreground: "0 84.2% 43.1%",
        card: "0 0% 100%",
        primary: "0 72.2% 50.6%",
        secondary: "0 85.7% 97.3%",
        accent: "0 72.2% 50.6%",
    },
    dark: {
        background: "0 71.4% 9.4%",
        foreground: "0 85.7% 97.3%",
        card: "0 71.4% 9.4%",
        primary: "0 84.2% 60.2%",
        secondary: "0 71.4% 14.5%",
        accent: "0 84.2% 60.2%",
    }
  },
  {
    name: 'blue',
    light: {
        background: "222.2 84% 97.8%",
        foreground: "222.2 84% 25.1%",
        card: "222.2 84% 97.8%",
        primary: "221.2 83.2% 53.3%",
        secondary: "222.2 84% 92.8%",
        accent: "221.2 83.2% 53.3%",
    },
    dark: {
        background: "222.2 84% 4.9%",
        foreground: "210 40% 98%",
        card: "222.2 84% 4.9%",
        primary: "217.2 91.2% 59.8%",
        secondary: "217.2 32.6% 17.5%",
        accent: "217.2 91.2% 59.8%",
    }
  },
  {
    name: 'yellow',
    light: {
        background: "47.9 95.8% 97.5%",
        foreground: "47.9 95.8% 34.5%",
        card: "47.9 95.8% 97.5%",
        primary: "47.9 95.8% 53.1%",
        secondary: "47.9 95.8% 92.5%",
        accent: "47.9 95.8% 53.1%",
    },
    dark: {
        background: "47.9 95.8% 10%",
        foreground: "47.9 95.8% 97%",
        card: "47.9 95.8% 10%",
        primary: "47.9 95.8% 50%",
        secondary: "47.9 95.8% 15%",
        accent: "47.9 95.8% 50%",
    }
  }
];
