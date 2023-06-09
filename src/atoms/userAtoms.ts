import { atom } from "recoil";
import pb from "../lib/pocketbase";

export interface UserState {
    isLogin: boolean;
    userId: string | undefined;
}

const defaultUserState: UserState = {
    isLogin: pb.authStore.isValid,
    userId: pb.authStore?.model?.id,
}

export const userState = atom<UserState>({
    key: "userState",
    default: defaultUserState,
});