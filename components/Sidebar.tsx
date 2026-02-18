'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Divider, IconButton, Typography, Box 
} from '@mui/material';
import { 
  LayoutDashboard, ShieldAlert, FileText, ClipboardCheck, 
  OctagonAlert, Shield, ChevronLeft, ChevronRight 
} from 'lucide-react';

const DRAWER_WIDTH = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const menuItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Risk Management', href: '/risks', icon: ShieldAlert },
  { name: 'Policies', href: '/policies', icon: FileText },
  { name: 'Incidents', href: '/incidents', icon: OctagonAlert },
  { name: 'Audits', href: '/audits', icon: ClipboardCheck },
  { name: 'Frameworks', href: '/compliance_frameworks', icon: Shield },
  { name: 'Audit Logs', href: '/audit-logs', icon: ClipboardCheck },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid #e5e7eb',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <Box sx={{ flexGrow: 1, ml: 2 }}>
           <Typography variant="h6" fontWeight="bold" color="primary">Arihant GRC</Typography>
        </Box>
        <IconButton onClick={onClose}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ px: 1, mt: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    '& .lucide': { color: 'primary.main' }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.name} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}