import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtoms";
import pb from "../lib/pocketbase";
import useSaveTheLocalStorageListsInDB from "./useSaveTheLocalStorageListsInDB";
import { authFormState } from "../atoms/showAuthFormAtoms";

export const useAfterSignInFlow = () => {
    const [{ authMode }, setAuthFormState] = useRecoilState(authFormState);
    const setUserState = useSetRecoilState(userState);

    const { saveLocalStorageListInDb } = useSaveTheLocalStorageListsInDB();

    const afterSignInFlow = () => {
        pb.authStore.isValid &&
            setUserState({
                isLogin: pb.authStore.isValid,
                userId: pb.authStore?.model?.id,
            });
        setAuthFormState({ showAuthForm: false, authMode });
        saveLocalStorageListInDb();
    };

    return afterSignInFlow ;
};
