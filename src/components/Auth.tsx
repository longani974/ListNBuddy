import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

type AuthProps = {
    // props
};

const Auth: React.FC<AuthProps> = () => {
    const [auth, setAuth] = useState<"login" | "signup">("login");

    const onChangeHandler = () => {
        auth === "login" ? setAuth("signup") : setAuth("login");
    };

    return (
        <div>
            {auth === "login" && <SignIn />}
            {auth === "signup" && <SignUp />}
            <div className="form-control">
                <label className="label cursor-pointer mt-6">
                    <span className="label-text">Créer un nouveau compte</span>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={auth === "login"}
                        onChange={onChangeHandler}
                    />
                    <span className="label-text">Me connecter</span>
                </label>
            </div>
        </div>
    );
};
export default Auth;
