'use client';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Menu, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useUser } from "@/context/AuthContext";
import { User } from '@/lib/types';

const DRAWER_WIDTH = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [{
    props: ({ open }) => open,
    style: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: `${DRAWER_WIDTH}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }],
}));

export default function TopBar({ user, open, onOpen }: { user: User; open: boolean; onOpen: () => void }) {
  const { logout } = useUser();

  return (
    <AppBar position="fixed" open={open} sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid #e5e7eb' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onOpen}
          edge="start"
          sx={[{ mr: 2 }, open && { display: 'none' }]}
        >
          <Menu size={24} />
        </IconButton>
        
        <Box sx={{ flexGrow: 1 }} />

        {/* User Info & Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
           <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight="600">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.role || 'User'}</Typography>
           </Box>
           <IconButton onClick={logout} color="error" size="small">
              <LogOut size={20} />
           </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}