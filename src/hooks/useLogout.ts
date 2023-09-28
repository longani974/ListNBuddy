import pb from "../lib/pocketbase";
import { useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtoms";

export default function useLogout() {
    const setUserState = useSetRecoilState(userState);

    function logout() {
        pb.authStore.clear();
        setUserState({ isLogin: false, userId: "" });
        //TODO: Find a better way
        // We reload the page to be sure that all the data is cleared (because we have two lists appearing when we log out again)
        window.location.reload();
    }

    return logout;
}
