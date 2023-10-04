import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { signInFormInput } from "../components/SignIn";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtoms";
import { authFormState } from "../atoms/showAuthFormAtoms";
import useSaveTheLocalStorageListsInDB from "./useSaveTheLocalStorageListsInDB";

export default function useSignIn() {
    const setUserState = useSetRecoilState(userState);
    const [{ authMode }, setAuthFormState] = useRecoilState(authFormState);
    const { saveLocalStorageListInDb } = useSaveTheLocalStorageListsInDB();

    async function signIn({ email, password }: signInFormInput) {
        const userData = await pb
            .collection("users")
            .authWithPassword(email, password)

        return userData;
    }

    return useMutation(signIn, {
        onSuccess: () => {
            pb.authStore.isValid &&
                setUserState({
                    isLogin: pb.authStore.isValid,
                    userId: pb.authStore?.model?.id,
                });
            setAuthFormState({ showAuthForm: false, authMode });
            saveLocalStorageListInDb();
        },
    });
}
