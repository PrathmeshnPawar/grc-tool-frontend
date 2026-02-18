// components/StatCard.tsx
import { StatCardProps } from '@/lib/types';
import { Paper, Typography, Box } from '@mui/material';

export default function StatCard({ title, value, icon, description, color }: StatCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ p: 1, backgroundColor: `${color}.light`, borderRadius: 1 }}>
          {icon}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
      </Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {description}
      </Typography>
    </Paper>
  );
}