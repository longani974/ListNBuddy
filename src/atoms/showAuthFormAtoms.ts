import { atom } from "recoil";

export interface AuthFormState {
    showAuthForm: boolean;
}

const defaultAuthFormeState: AuthFormState = {
    showAuthForm: false,
}

export const authFormState = atom<AuthFormState>({
    key: "AuthFormState",
    default: defaultAuthFormeState,
});