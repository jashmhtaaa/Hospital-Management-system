var __DEV__: boolean;
  interface Window {
    [key: string]: any
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any
    }
  }
}

"use client";
export const dynamic = 'force-dynamic';

import React from "react";
import RadiologyReportDetail from "@/components/radiology/radiology-report-detail";

export default const ReportDetailPage = () {
  return <RadiologyReportDetail />
}
