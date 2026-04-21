'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

type RightPanelContextType = {
  rightPanel: ReactNode;
  setRightPanel: Dispatch<SetStateAction<ReactNode>>;
};

const RightPanelContext = createContext<RightPanelContextType>({
  rightPanel: null,
  setRightPanel: () => {},
});

export function RightPanelProvider({ children }: { children: ReactNode }) {
  const [rightPanel, setRightPanelRaw] = useState<ReactNode>(null);

  // stable reference — won't change between renders
  const setRightPanel = useCallback<Dispatch<SetStateAction<ReactNode>>>(
    (v) => setRightPanelRaw(v),
    []
  );

  return (
    <RightPanelContext.Provider value={{ rightPanel, setRightPanel }}>
      {children}
    </RightPanelContext.Provider>
  );
}

export function useRightPanel() {
  return useContext(RightPanelContext);
}
