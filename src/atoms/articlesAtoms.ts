import { atom } from "recoil";
import { Article } from "../types/dbPocketbasetypes";

export interface articlesState {
    articles: Article[];
}

const defaultarticlesState: articlesState = {
    articles: [],
}

export const articlesState = atom<articlesState>({
    key: "articlesState",
    default: defaultarticlesState,
});