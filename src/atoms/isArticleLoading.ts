import { atom } from "recoil";

export interface isArticleFetching {
    isLoadingState: boolean;
}

const defaultisArticleFetchingState: isArticleFetching = {
    isLoadingState: false,
}

export const isArticleFetchingState = atom<isArticleFetching>({
    key: "isArticleLoadingState",
    default: defaultisArticleFetchingState,
});