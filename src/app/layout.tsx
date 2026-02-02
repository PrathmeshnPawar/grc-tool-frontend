// src/app/layout.tsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme'; // Your MUI theme file
import NavigationLayout from '../components/NavigationLayout'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {/* This is the key: The NavigationLayout wraps the 'children',
               so every page (Dashboard, Risk, etc.) appears inside 
               the main content area of the sidebar/appbar.
            */}
            <NavigationLayout>
              {children}
            </NavigationLayout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}