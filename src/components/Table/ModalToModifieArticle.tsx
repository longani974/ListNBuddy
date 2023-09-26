import React, { useEffect, useState } from "react";
import { Article, Lists } from "../../types/dbPocketbasetypes";
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
import { useLocalStorage } from "usehooks-ts";

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
    articlesLength: number;
};

const maxArticles = 100;

const ModalToModifieArticle: React.FC<ModalToModifieArticleProps> = ({
    articleData,
    listId,
    mode,
    articlesLength,
}) => {
    const [articleId, setArticleId] = useState<string>(articleData?.id || "");

    const { userId, isLogin } = useRecoilValue(userState);
    // This state is used to display the loading state in the Table component
    const setIsLoading = useSetRecoilState(isArticleFetchingState);

    const [localStorageLists, setLocalStorageLists] = useLocalStorage<Lists[]>(
        "listnbuddy_lists",
        []
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
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

        // If the user is offline and not signed up we update the article in the local storage using useHook
        if (!isLogin || (!isLogin && !isOnline)) {
            // Find the article in the local storage that match the articleId
            console.log(data);
            const lists = localStorageLists;
            lists.forEach((list) => {
                list.expand.articles.forEach((article, index) => {
                    if (article.id === articleId) {
                        list.expand.articles[index] = {
                            ...data,
                            isBuyed: article.isBuyed,
                            id: articleId,
                        } as unknown as Article;
                    }
                });
            });

            setLocalStorageLists(lists);

            return;
        }

        const { mutateAsync, isSuccess } = articleModifier;
        await mutateAsync({ ...data, id: articleId });
        if (isSuccess) {
            reset();
        }
    };

    const handleDeleteArticle = async () => {
        // TODO: find a way to close the modal after the article is deleted
        // We invoke the clickModal function twice to close the modal
        // Apparently the first clickModal call is not enough to close the modal
        // It's seem when we close the modal the first time, something reopen it
        // It's a hack, but it works
        clickModal("articleModal");
        clickModal("articleModal");

        // If the user is offline and not signed up we delete the article in the local storage using useHook
        if (!isLogin || (!isLogin && !isOnline)) {
            // Find the article in the local storage that match the articleId
            const lists = localStorageLists;
            lists.forEach((list) => {
                list.expand.articles.forEach((article, index) => {
                    if (article.id === articleId) {
                        list.expand.articles.splice(index, 1);
                    }
                });
            });

            setLocalStorageLists(lists);

            return;
        }

        const { mutateAsync, isSuccess } = articleDeleter;
        await mutateAsync(articleId);
        if (isSuccess) {
            reset();
        }
    };

    // Create a list in the lodal storage if the user is offline
    const createArticleLocalStorage = (data: {
        quantity?: string | undefined;
        name: string;
    }) => {
        // Create a list in the local storage
        const article = {
            ...data,
            list: listId,
            addBy: userId,
            isBuyed: false,
            id: Date.now().toString(),
        } as unknown as Article;
        // const lists = JSON.parse(localStorage.getItem("lists") || "[]");
        const lists = localStorageLists;
        // TODO: fix the type of lists is unknown
        lists?.forEach((list) => {
            if (list.id === listId) {
                list.expand.articles.push(article);
            }
        });

        setLocalStorageLists(lists);

        // localStorage.setItem("lists", JSON.stringify(lists));
        // Reload the page to update the lists
        // TODO: find a better way to update the lists
        // window.location.reload();
    };

    const handleAddNewArticle: SubmitHandler<FormData> = async (data) => {
        clickModal("articleModal");

        // Create a list in the local storage if the user is offline
        if (!isLogin || (!isLogin && !isOnline)) {
            // createListLocalStorage(listName);
            createArticleLocalStorage(data);
            reset();
            return;
        }

        const { mutateAsync, isSuccess } = newArticleAdder;
        await mutateAsync({
            ...data,
            list: listId,
            addBy: userId,
            isBuyed: false,
        });
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
                        {mode === "create"
                            ? "Ajouter un article"
                            : "Fenêtre de modification"}
                    </h3>
                    {!isOnline && (
                        <div className="alert alert-error">
                            Vous êtes hors ligne, vous ne pouvez pas apporter de
                            modifications.
                        </div>
                    )}
                    {articlesLength >= maxArticles && mode === "create" && (
                        <div className="alert alert-warning">
                            Désolé, vous avez déjà 100 articles dans cette
                            liste. Vous ne pouvez pas en ajouter plus.
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
                                    className={`btn btn-primary mt-4 w-full ${
                                        articlesLength >= maxArticles &&
                                        "btn-disabled"
                                    }`}
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
