import { atom } from "recoil";

export interface listToShowState {
    indexListToShow: number;
}

const defaultListToShowState: listToShowState = {
    indexListToShow: 0,
}

export const listToShow = atom<listToShowState>({
    key: "listToShowState",
    default: defaultListToShowState,
});