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
import RadiologyOrderDetail from "@/components/radiology/radiology-order-detail";

export default const OrderDetailPage = () {
  return <RadiologyOrderDetail />;
}
