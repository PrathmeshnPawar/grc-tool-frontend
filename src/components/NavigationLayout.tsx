"use client";
import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Gavel,
  ReportProblem,
  Assignment,
  Settings,
  Warning,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function GRCLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

 // Inside src/components/NavigationLayout.tsx
const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Risks", icon: <ReportProblem />, path: "/risk" }, // Risk entity
  { text: "Compliance", icon: <Gavel />, path: "/compliance" }, // ComplianceFramework
  { text: "Audits", icon: <Assignment />, path: "/audit" }, // Audit entity
  { text: "Policies", icon: <Assignment />, path: "/policies" }, // Policy entity
  { text: "Incidents", icon: <Warning />, path: "/incident" }, // Incident entity
  { text: "Vendors", icon: <Settings />, path: "/vendors" }, // Vendor entity
  { text: "Users", icon: <Settings />, path: "/users-and-roles" }, // User entity
];

  const drawerContent = (
    <div>
      <Toolbar>
        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
          GRC Portal
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
  href={item.path}
  sx={{
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    '&.Mui-selected': {
      bgcolor: 'rgba(59, 130, 246, 0.08)',
      color: 'secondary.main',
      '& .MuiListItemIcon-root': {
        color: 'secondary.main',
      },
    },
  }}
>
  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
  <ListItemText 
    primary={item.text} 
    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} 
  />
</ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Enterprise Governance
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* Offset for fixed AppBar */}
        {/* Contextual Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">Current Page</Typography>
        </Breadcrumbs>
        {children}
      </Box>
    </Box>
  );
}
