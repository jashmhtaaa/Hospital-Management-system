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

import { cn } from "@/lib/utils";

const Skeleton = ({
  className,
  ...props;
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div;
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton }
