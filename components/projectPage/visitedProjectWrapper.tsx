'use client';
import { useEffect } from 'react';
import { useVisited } from "../contexts";

interface VisitedProjectWrapperProps {
  slug: string;
}

export default function VisitedProjectWrapper ({ slug }: VisitedProjectWrapperProps) {
  const [visited, setVisited] = useVisited();
  useEffect(() => {
    if (!visited.includes(slug)) {
      setVisited([...visited, slug]);
    }
  }, [setVisited, slug, visited]);
  return null;
};
