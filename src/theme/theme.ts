import { createTheme } from '@mui/material/styles';
import { cleanAiColors, layoutTokens } from './tokens';

export const createCleanAiTheme = (mode: 'light' | 'dark' = 'light') => {
  const dark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: cleanAiColors.primary, contrastText: cleanAiColors.onPrimary },
      secondary: { main: cleanAiColors.secondary, contrastText: cleanAiColors.onSecondary },
      warning: { main: cleanAiColors.tertiary },
      error: { main: cleanAiColors.error },
      background: {
        default: dark ? cleanAiColors.darkBackground : cleanAiColors.lightBackground,
        paper: dark ? cleanAiColors.darkSurface : cleanAiColors.lightSurface,
      },
      text: {
        primary: dark ? cleanAiColors.darkText : cleanAiColors.lightText,
        secondary: dark ? cleanAiColors.darkMutedText : cleanAiColors.lightMutedText,
      },
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      h4: { fontWeight: 750 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 650, textTransform: 'none' },
    },
    shape: { borderRadius: layoutTokens.borderRadius },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
      MuiTableHead: {
        styleOverrides: {
          root: ({ theme }) => ({ backgroundColor: theme.palette.action.hover }),
        },
      },
      MuiTableCell: { styleOverrides: { head: { fontWeight: 700 } } },
    },
  });
};

export const cleanAiTheme = createCleanAiTheme();
