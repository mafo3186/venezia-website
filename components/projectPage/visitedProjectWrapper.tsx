'use client';
import { useEffect } from 'react';

interface VisitedProjectWrapperProps {
  slug: string;
}

export default function VisitedProjectWrapper ({ slug }: VisitedProjectWrapperProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const visitedProjects = JSON.parse(localStorage.getItem('visitedProjects') || '[]');
      if (!visitedProjects.includes(slug)) {
        const updatedVisitedProjects = [...visitedProjects, slug];
        localStorage.setItem('visitedProjects', JSON.stringify(updatedVisitedProjects));

        // Dispatch event AFTER updating localStorage
        window.dispatchEvent(new Event('visitedProjectsUpdated'));
      }
    }
  }, [slug]);

  return null;
};
