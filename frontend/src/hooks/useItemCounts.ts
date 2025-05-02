import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface ItemCounts {
  tasks: number;
  lessons: number;
  courses: number;
}

export function useItemCounts() {
  const [counts, setCounts] = useState<ItemCounts>({
    tasks: 0,
    lessons: 0,
    courses: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [lessonsRes, coursesRes, tasksRes] = await Promise.all([
          fetch('/api/lessons/count'),
          fetch('/api/courses/count'),
          fetch('/api/tasks/count')
        ]);

        if (!lessonsRes.ok || !coursesRes.ok || !tasksRes.ok) {
          throw new Error('Failed to fetch counts');
        }

        const [lessonsCount, coursesCount, tasksCount] = await Promise.all([
          lessonsRes.json(),
          coursesRes.json(),
          tasksRes.json()
        ]);

        setCounts({
          tasks: tasksCount,
          lessons: lessonsCount,
          courses: coursesCount
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
        toast({
          title: "Error",
          description: "Failed to load item counts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { counts, isLoading };
} 