'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewLessonPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard where the quick capture form is
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
