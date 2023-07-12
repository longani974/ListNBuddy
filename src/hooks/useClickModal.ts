import { useCallback } from 'react';

export const useClickModal = () => {
  const clickModal = useCallback((modalId: string) => {
    console.log(modalId)
    const modal = document.getElementById(modalId);
    modal?.click();
  }, []);

  return { clickModal };
};
