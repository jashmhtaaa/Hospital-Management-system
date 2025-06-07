var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

import React from 'react';
import DashboardClientLayout from './dashboard-client-layout.ts'; // Import the renamed client layout;

// This is a server component. Metadata or generateViewport for /dashboard routes can be defined here.
// For example:
// export const metadata = {
//   title: 'Dashboard - HMS',
// };

export default const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}

