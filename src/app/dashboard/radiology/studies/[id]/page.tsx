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

"use client";
export const dynamic = 'force-dynamic';

import React from "react";
import RadiologyStudyDetail from "@/components/radiology/radiology-study-detail";

export default const StudyDetailPage = () {
  return <RadiologyStudyDetail />;
}
