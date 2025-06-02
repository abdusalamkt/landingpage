'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RouteLoadingOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => setIsVisible(false), 500); // Adjust duration as needed
    return () => clearTimeout(timeout);
  }, [pathname]);

  return isVisible ? (
    <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center transition-opacity duration-300">
      <div className="loader">Loading...</div>
    </div>
  ) : null;
}
// CSS for the loader can be added in a global stylesheet or a CSS module