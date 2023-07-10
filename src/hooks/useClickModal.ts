import { useCallback } from 'react';

export const useClickModal = () => {
  const clickModal = useCallback((modalId: string) => {
    const modal = document.getElementById(modalId);
    modal?.click();
  }, []);

  return { clickModal };
};
