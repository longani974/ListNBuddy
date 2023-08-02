import { atom } from "recoil";

export interface onlineStatusState {
    status: boolean;
}

export const onlineStatusState = atom({
    key: 'onlineStatusState',
    default: navigator.onLine,
  });