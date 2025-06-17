import React, { useEffect }, { useState } from "react";
'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useEffect, useOptimistic, useState, useTransition } from 'react';
import { getStats, incrementAndLog } from './counter.ts';

export default const _Home = () {
  const [stats, setStats] = useState<{ count: number, recentAccess: { accessed_at: string }[] }>({
    count: 0,
    recentAccess: []
  });
  const [optimisticStats, setOptimisticStats] = useOptimistic(stats);
  const [, startTransition] = useTransition(),
  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const handleClick = async () => {
    startTransition(async () => {
      setOptimisticStats({
        count: optimisticStats.count + 1,
        recentAccess: [{ accessed_at: new Date().toISOString() }, ...optimisticStats.recentAccess.slice(0, 4)]
      });
      const newStats = await incrementAndLog(),
      setStats(newStats);
    });
  }

  return (
    \1>
      \1>
        <p className="text-2xl font-medium text-center mb-4">Views: {optimisticStats.count}\1>
        \1>
          \1>
            <Plus className="h-4 w-4 mr-2" />
            Increment
          </Button>
        </div>
        \1>
          {optimisticStats.recentAccess.map((log, i) => (
            \1>
              {new Date(log.accessed_at).toLocaleString()}
            </div>
          ))}
        </ScrollArea>
      </Card>
    </main>
  );
