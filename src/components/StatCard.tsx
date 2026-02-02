"use client";
import React from 'react';
import { Paper, Box, Typography, Chip, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const StatCard = ({ title, value, trend, icon, color }: StatCardProps) => {
  const isPositive = trend >= 0;

  return (
    <Paper 
      sx={{ 
        p: 2.5, 
        borderRadius: 3, // Matches the modern soft-corner design
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        {/* Icon Container with Soft Background */}
        <Box 
          sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            display: 'flex', 
            bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
            color: `${color}.main`
          }}
        >
          {icon}
        </Box>

        {/* Trend Pill */}
        <Chip 
          label={`${isPositive ? '+' : ''}${trend}%`} 
          size="small"
          icon={isPositive ? <TrendingUp style={{ fontSize: 16 }} /> : <TrendingDown style={{ fontSize: 16 }} />}
          sx={{ 
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: isPositive ? '#ecfdf5' : '#fef2f2',
            color: isPositive ? '#10b981' : '#ef4444',
            border: 'none',
            '& .MuiChip-icon': { color: 'inherit' }
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: 'text.primary' }}>
        {value}
      </Typography>
    </Paper>
  );
};

export default StatCard;