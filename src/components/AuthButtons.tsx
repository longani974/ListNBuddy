import { useSetRecoilState } from "recoil";
import { authFormState } from "../atoms/showAuthFormAtoms";

type AuthButtonsType = {
    // props
};

const AuthButtons: React.FC<AuthButtonsType> = () => {
    const setAuthFormState = useSetRecoilState(authFormState);

    return (
        <>
            <button
                className="btn btn-primary mt-4 w-full"
                onClick={() =>
                    setAuthFormState({ showAuthForm: true, authMode: "login" })
                }
            >
                Se connecter
            </button>
            <button
                className="btn btn-primary mt-4 w-full"
                onClick={() =>
                    setAuthFormState({
                        showAuthForm: true,
                        authMode: "signup",
                    })
                }
            >
                S'inscrire
            </button>
        </>
    );
};

export default AuthButtons;
