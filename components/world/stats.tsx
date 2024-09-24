/*
* Vendored from react-three-fiber/drei: https://drei.docs.pmnd.rs/misc/stats
*/

import * as React from 'react';
import { addEffect, addAfterEffect } from '@react-three/fiber';
import StatsImpl from 'stats.js';
import { useEffectfulState } from '@react-three/drei/helpers/useEffectfulState.js';

const StatsContext = React.createContext<StatsImpl | null>(null);

/**
 * Renders a performance statistics panel using Stats.js.
 *
 * @component
 * @example
 * ```tsx
 * import Stats, { Panel, useStats } from './stats';
 *
 * function App() {
 *   const stats = useStats();
 *
 *   return (
 *     <Stats>
 *       <Panel title="FPS" value={stats?.fps || 0} maxValue={60} />
 *       <Panel title="MS" value={stats?.ms || 0} maxValue={16} />
 *     </Stats>
 *   );
 * }
 * ```
 */
export default function Stats({
  showPanel = 0,
  className,
  parent,
  children
}: { showPanel?: number, className?: string, parent?: React.RefObject<HTMLElement>, children?: React.ReactNode }) {
  const stats = useEffectfulState(() => new StatsImpl(), []);
  React.useEffect(() => {
    if (stats) {
      const node = parent && parent.current || document.body;
      stats.showPanel(showPanel);
      node == null || node.appendChild(stats.dom);
      const classNames = (className !== null && className !== void 0 ? className : '').split(' ').filter(cls => cls);
      if (classNames.length) stats.dom.classList.add(...classNames);
      const begin = addEffect(() => stats.begin());
      const end = addAfterEffect(() => stats.end());
      return () => {
        if (classNames.length) stats.dom.classList.remove(...classNames);
        node == null || node.removeChild(stats.dom);
        begin();
        end();
      };
    }
  }, [parent, stats, className, showPanel]);
  return (
    <StatsContext.Provider value={stats || null}>
      {children}
    </StatsContext.Provider>
  );
}

// Custom hook to use the stats context
export const useStats = () => {
  return React.useContext(StatsContext);
};

/**
 * Renders a panel inside a Stats component.
 * 
 * @param title - The title of the panel.
 * @param foreground - The foreground color of the panel.
 * @param background - The background color of the panel.
 * @param value - The value to display in the panel. Only integers are supported.
 * @param maxValue - The maximum value of the panel. Only integers are supported.
 * 
 * @component
 * @example
 * ```tsx
 * import Stats, { Panel, useStats } from './stats';
 *
 * function App() {
 *   const stats = useStats();
 *
 *   return (
 *     <Stats>
 *       <Panel title="FPS" value={stats?.fps || 0} maxValue={60} />
 *       <Panel title="MS" value={stats?.ms || 0} maxValue={16} />
 *     </Stats>
 *   );
 * }
 */
export function Panel({ title, foreground = '#0ff', background = '#002', value, maxValue }: { title: string, foreground?: string, background?: string, value: number, maxValue: number }) {
  const stats = useStats();
  const panel = React.useMemo(() => new StatsImpl.Panel(title, foreground, background), [title, foreground, background]);

  React.useEffect(() => {
    if (stats) {
      stats.addPanel(panel);
    }
    // tbh idk if this actually works :shrug:
    return () => {
      if (stats) {
        panel.dom.remove();
      }
    }
  }, [stats, panel]);

  React.useEffect(() => {
    panel.update(value, maxValue);
    return;
  }, [panel, value, maxValue]);

  return (<></>)
}