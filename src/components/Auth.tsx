import React from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { authFormState } from "../atoms/showAuthFormAtoms";
import { useRecoilState } from "recoil";
import pb from "../lib/pocketbase";
import { useAfterSignInFlow } from "../hooks/useAfterSignInFlow";

type AuthProps = {
    // props
};

const Auth: React.FC<AuthProps> = () => {
    const [{ authMode, showAuthForm }, setAuthFormState] =
        useRecoilState(authFormState);

    const onChangeHandler = () => {
        setAuthFormState({
            showAuthForm,
            authMode: authMode === "login" ? "signup" : "login",
        });
    };

    const afterSignInFlow = useAfterSignInFlow();

    return (
        <div className="flex flex-col max-w-lg gap-4 m-auto mt-10 p-4 rounded-lg relative">
            <label
                onClick={() =>
                    setAuthFormState({ showAuthForm: false, authMode })
                }
                className="btn btn-sm btn-circle btn-primary absolute right-4 -top-6
                "
            >
                ✕
            </label>
            <button
                className="btn btn-primary mt-6"
                onClick={async () => {
                    const userData = await pb
                        .collection("users")
                        .authWithOAuth2({ provider: "google" })
                        .then(() => {
                            afterSignInFlow();
                        })
                        .catch((err) => {
                            console.log(err);
                        });

                    return userData;
                }}
            >
                Se connecter avec google
            </button>

            <div className="divider pt-6 pb-6">Ou</div>


            {authMode === "login" && <SignIn />}
            {authMode === "signup" && <SignUp />}
            <div className="form-control">
                <label className="label cursor-pointer mt-6">
                    <span className="label-text">Créer un nouveau compte</span>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={authMode === "login"}
                        onChange={onChangeHandler}
                    />
                    <span className="label-text">Me connecter</span>
                </label>
            </div>
        </div>
    );
};
export default Auth;
