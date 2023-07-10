import pb from "../lib/pocketbase";
import { useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtoms";

export default function useLogout() {
    const setUserState = useSetRecoilState(userState);

    function logout() {
        pb.authStore.clear();
        setUserState({ isLogin: false, userId: "" });
    }

    return logout;
}
