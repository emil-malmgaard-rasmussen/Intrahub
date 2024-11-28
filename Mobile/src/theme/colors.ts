const colors: Record<ColorThemeName, ThemeColors> = {
  light: {
    text: {
      default: '#222',
      active: 'rgb(2, 133, 199)',
      label: 'rgb(41,54,73)',
      lightGray: 'rgb(41,54,73)',
      light: '#fff',
      inverse: '#fff',
    },
    textMuted: '#718096',
    backgrounds: {
      main: '#3f6079',
      footer: '#fff',
      header: 'rgb(2, 133, 199)',
      light: '#fff',
    },
    header: {
      main: '#3f6079',
      active: 'rgb(255, 255, 255)',
    },
    icon: {
      default: '#222',
      dark: '#000',
      light: '#fff',
      active: 'rgb(2, 133, 199)',
      muted: '#C6C6C6',
    },
    border: 'rgb(209, 213, 219)',
    input: 'rgb(255, 255, 255)',
    button: {
      main: '#3f6079',
      secondary: '#FF7043',
      muted: 'rgb(209, 213, 219)',
    },
    navigation: {
      bottom: {
        active: '#3f6079',
      },
    },
  },
  dark: {
    text: {
      default: '#fff',
      active: 'rgb(2, 133, 199)',
      label: 'rgb(78,94,117)',
      lightGray: 'rgb(207,207,207)',
      light: '#fff',
      inverse: '#222',
    },
    textMuted: '#718096',
    backgrounds: {
      main: 'rgb(17, 24, 39)',
      footer: 'rgb(31, 41 ,55)',
      header: 'rgb(31, 41 ,55)',
      light: '#fff',
    },
    header: {
      main: 'rgb(31, 41 ,55)',
      active: 'rgb(2, 133, 199)',
    },
    icon: {
      default: '#fff',
      dark: '#000',
      light: '#fff',
      active: 'rgb(2, 133, 199)',
      muted: '#C6C6C6',
    },
    border: 'rgb(55, 65, 81)',
    input: 'rgb(17, 24, 39)',
    button: {
      main: 'rgb(2, 133, 199)',
      secondary: '#FF7043',
      muted: 'rgb(55, 65, 81)',
    },
    navigation: {
      bottom: {
        active: '#7a9ebf',
      },
    },
  },
};

export default colors;

export type ThemeColors = {
  text: {
    default: string;
    active: string;
    label: string;
    lightGray: string;
    light: string;
    inverse: string;
  };
  textMuted: string;
  backgrounds: {
    main: string;
    footer: string;
    header: string;
    light: string;
  };
  header: {
    main: string;
    active: string;
  };
  icon: {
    default: string;
    dark: string;
    light: string;
    active: string;
    muted: string;
  };
  border: string;
  input: string;
  button: {
    main: string;
    secondary: string;
    muted: string;
  };
  navigation: {
    bottom: {
      active: string;
    };
  };
};

export type ColorThemeName = 'light' | 'dark';
