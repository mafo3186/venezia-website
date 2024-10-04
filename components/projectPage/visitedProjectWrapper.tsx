'use client'; 
import { useEffect } from 'react';

interface VisitedProjectWrapperProps {
  slug: string;
}

export default function VisitedProjectWrapper  ({ slug }: VisitedProjectWrapperProps) {
  useEffect(() => {
    const visitedProjects = JSON.parse(localStorage.getItem('visitedProjects') || '[]');
    if (!visitedProjects.includes(slug)) {
      const updatedVisitedProjects = [...visitedProjects, slug];
      localStorage.setItem('visitedProjects', JSON.stringify(updatedVisitedProjects));
    }
  }, [slug]);
  
  return null; 
};

