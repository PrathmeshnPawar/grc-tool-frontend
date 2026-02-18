'use client';
import { usePathname } from 'next/navigation';
import { Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DynamicBreadcrumbs() {
  const pathname = usePathname();
  // Split path: /compliance_frameworks/[id] -> ["compliance_frameworks", "[id]"]
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumbs separator={<ChevronRight size={14} />} sx={{ mb: 3 }}>
      <MuiLink component={Link} href="/dashboard" underline="hover" color="inherit">
        Home
      </MuiLink>
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        
        // Transform "compliance_frameworks" to "Compliance Frameworks"
        const label = segment.replace(/_/g, ' ').replace(/-/g, ' ');

        return isLast ? (
          <Typography key={href} color="text.primary" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
            {label}
          </Typography>
        ) : (
          <MuiLink key={href} component={Link} href={href} underline="hover" color="inherit" sx={{ textTransform: 'capitalize' }}>
            {label}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
}