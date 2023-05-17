import { atom } from "recoil";
import pb from "../lib/pocketbase";

export interface UserState {
    isLogin: boolean;
}

const defaultUserState: UserState = {
    isLogin: pb.authStore.isValid,
}

export const userState = atom<UserState>({
    key: "userState",
    default: defaultUserState,
});