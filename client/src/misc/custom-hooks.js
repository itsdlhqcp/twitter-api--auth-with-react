import { useState, useCallback, useEffect } from "react";

export function useModalState(defaultValue = false){
    const [isOpen, setIsOpen] = useState(defaultValue);

    const open = useCallback(() => setIsOpen(true),[]);
    const close = useCallback(() => setIsOpen(false),[]);

    return { 
      isOpen,
      open,
      close
    };
    
}

export const useMediaQuery = query => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  
    useEffect(() => {
      const queryList = window.matchMedia(query);
      setMatches(queryList.matches);
  
      const listener = event => setMatches(event.matches);
 
      queryList.addEventListener('change', listener);
      
      return () => {
        queryList.removeEventListener('change', listener);
      };
    }, [query]);
  
    return matches;
  };