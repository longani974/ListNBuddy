import React from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { authFormState } from "../atoms/showAuthFormAtoms";
import { useRecoilState } from "recoil";

type AuthProps = {
    // props
};

const Auth: React.FC<AuthProps> = () => {
    const [{ authMode, showAuthForm }, setAuthFormState] = useRecoilState(authFormState);


    const onChangeHandler = () => {
        setAuthFormState({ showAuthForm, authMode: authMode === "login" ? "signup" : "login" });
    };

    return (
        <div>
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
