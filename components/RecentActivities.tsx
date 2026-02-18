'use client';
import { 
  Typography, List, ListItem, ListItemText, ListItemAvatar, 
  Avatar, Box, Chip, Tooltip 
} from '@mui/material';
import { User, Database, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // Wizard Tip: Install date-fns for "2 mins ago" formatting

interface AuditLog {
  id: string;
  action: string;
  entityName: string;
  performedBy: string;
  createdAt: string;
}

export default function RecentActivity({ logs }: { logs: AuditLog[] }) {
  // Senior Move: Sort by newest first and limit to the top 5 for the dashboard widget
  const displayLogs = [...logs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getIcon = (action: string) => {
    if (action.includes('CREATE')) return <Database size={20} color="#4caf50" />;
    if (action.includes('UPDATE')) return <ShieldCheck size={20} color="#2196f3" />;
    return <AlertCircle size={20} color="#ff9800" />;
  };

  if (displayLogs.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
        No recent activity recorded.
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Recent Activity
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {displayLogs.map((log) => (
          <ListItem key={log.id} alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'grey.100' }}>
                {getIcon(log.action)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {log.action.replace('_', ' ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography variant="caption" component="span" display="block">
                  {log.performedBy} modified {log.entityName}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}