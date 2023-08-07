import React, { useEffect, useState } from "react";
import { Article } from "../../types/dbPocketbasetypes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../atoms/userAtoms";
import { useArticleModifier } from "../../hooks/useArticleModifier";
import { useArticleDeleter } from "../../hooks/useArticleDeleter";
import { useNewArticleAdder } from "../../hooks/useNewArticleAdder";
import { isArticleFetchingState } from "../../atoms/isArticleLoading";
import { onlineStatusState } from "../../atoms/onlineStatusAtoms";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    mixed,
    string,
    number,
    date,
    boolean,
    object,
    array,
} from "../../utils/yupTranslate"; // Remplacez './yourLocaleFile' par le chemin vers votre fichier de traduction
import FormErrorMsg from "../FormErrorMsg";
import { useClickModal } from "../../hooks/useClickModal";

// Set yup locale for validation error messages
// We use the yupTranslate file to translate the error messages
yup.setLocale({
    mixed: mixed,
    string: string,
    number: number,
    date: date,
    boolean: boolean,
    object: object,
    array: array,
});

// Define the yup schema for form validation
const schema = yup
    .object({
        name: yup.string().min(2).max(50).required().label("L'article"),
        quantity: yup.string().max(50).label("Quantité de l'article à ajouter"),
    })
    .required();

// Define the type of the form data (used by react-hook-form) from the yup schema
type FormData = yup.InferType<typeof schema>;

// Define the props for the react component
type ModalToModifieArticleProps = {
    articleData: Article | null;
    listId: string;
    mode: "update" | "create";
    articlesList: string[];
};

const ModalToModifieArticle: React.FC<ModalToModifieArticleProps> = ({
    articleData,
    listId,
    mode,
}) => {
    const [articleId, setArticleId] = useState<string>(articleData?.id || "");


    const { userId } = useRecoilValue(userState);
    // This state is used to display the loading state in the Table component
    const setIsLoading = useSetRecoilState(isArticleFetchingState);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue
    } = useForm<FormData>({
        resolver: yupResolver<FormData>(schema),
    });

    useEffect(() => {
        setArticleId(articleData?.id || "");
        setValue("name", articleData?.name || "");
        setValue("quantity", articleData?.quantity || "");
    }, [articleData?.id, articleData?.name, articleData?.quantity, setValue]);

    const articleModifier = useArticleModifier();

    const { isLoading } = articleModifier;
    const isOnline = useRecoilValue(onlineStatusState);

    const { clickModal } = useClickModal();

    useEffect(() => {
        isLoading !== undefined && setIsLoading({ isLoadingState: isLoading });
    }, [isLoading, setIsLoading]);

    const articleDeleter = useArticleDeleter();

    const newArticleAdder = useNewArticleAdder();

    const handleModifieArticle: SubmitHandler<FormData> = async (data) => {
        clickModal("articleModal");

        const { mutateAsync, isSuccess } = articleModifier;
        await mutateAsync({ ...data, id: articleId });
        if (isSuccess) {
            reset();
        }
    };

    const handleDeleteArticle = async () => {
        clickModal("articleModal");

        const { mutateAsync, isSuccess } = articleDeleter;
        await mutateAsync(articleId);
        if (isSuccess) {
            reset();
        }
    };

    const handleAddNewArticle: SubmitHandler<FormData> = async (data) => {
        clickModal("articleModal");

        const { mutateAsync, isSuccess } = newArticleAdder;
        await mutateAsync({ ...data, list: listId, addBy: userId, isBuyed: false });
        if (isSuccess) {
            reset();
        }
    };

    return (
        <>
            {/* Put this part before </body> tag */}
            <input type="checkbox" id="articleModal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label
                        htmlFor="articleModal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">
                        Fenêtre de modification
                    </h3>
                    {!isOnline && (
                        <div className="alert alert-error">
                            Vous êtes hors ligne, vous ne pouvez pas apporter de
                            modifications.
                        </div>
                    )}
                    <div className="py-4">
                        <form className="flex flex-col">
                            <label className="label">
                                <span className="label-text">Article</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Article"
                                className="input input-bordered w-100%"
                                {...register("name")}
                            />
                            <FormErrorMsg messageError={errors.name?.message} />

                            <label className="label">
                                <span className="label-text">Qté</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Quantitée"
                                className="input input-bordered w-full"
                                {...register("quantity")}
                            />
                            <FormErrorMsg
                                messageError={errors.quantity?.message}
                            />
                        </form>
                        {mode === "update" && (
                            <>
                                <label
                                    htmlFor="articleModal"
                                    className={`btn btn-primary mt-4 w-full ${
                                        !isOnline && "btn-disabled"
                                    }`}
                                    onClick={handleSubmit(handleModifieArticle)}
                                >
                                    Modifier
                                </label>
                                <div className="divider"></div>
                                <label
                                    htmlFor="articleModal"
                                    className={`btn btn-primary mt-4 w-full ${
                                        !isOnline && "btn-disabled"
                                    }`}
                                    onClick={handleDeleteArticle}
                                >
                                    Supprimer
                                </label>
                            </>
                        )}
                        {mode === "create" && (
                            <>
                                <label
                                    htmlFor="articleModal"
                                    className="btn btn-primary mt-4 w-full"
                                    onClick={handleSubmit(handleAddNewArticle)}
                                >
                                    Ajouter
                                </label>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default ModalToModifieArticle;
