'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/Topbar';
import { useUser } from "@/context/AuthContext";

const DRAWER_WIDTH = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${DRAWER_WIDTH}px`,
  variants: [{
    props: ({ open }) => open,
    style: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser(); // Ensure you're pulling 'loading' from context
  const [open, setOpen] = React.useState(true);

  // 1. Wizard Tip: Handle the loading state first to avoid the null mismatch
  if (loading) return <div>Loading GRC Environment...</div>;

  // 2. Type Guard: Ensure user is not null before passing to TopBar
  if (!user) return null; // Or redirect, which your useEffect already handles

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f9fafb', minHeight: '100vh' }}>
      <CssBaseline />
      {/* TypeScript is now happy because 'user' is guaranteed to be a 'User' here */}
      <TopBar user={user} open={open} onOpen={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
}