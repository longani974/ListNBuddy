import { atom } from "recoil";

export interface AuthFormState {
    showAuthForm: boolean;
    authMode: "login" | "signup";
}

const defaultAuthFormeState: AuthFormState = {
    showAuthForm: false,
    authMode: "login",
};

export const authFormState = atom<AuthFormState>({
    key: "AuthFormState",
    default: defaultAuthFormeState,
});
