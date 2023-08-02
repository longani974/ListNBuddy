import React, { useEffect, useState } from "react";
import { Article } from "../../types/dbPocketbasetypes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../atoms/userAtoms";
import { useArticleModifier } from "../../hooks/useArticleModifier";
import { useArticleDeleter } from "../../hooks/useArticleDeleter";
import { useNewArticleAdder } from "../../hooks/useNewArticleAdder";
import { isArticleFetchingState } from "../../atoms/isArticleLoading";
import { onlineStatusState } from "../../atoms/onlineStatusAtoms";

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
    const [articleName, setArticleName] = useState<string>(
        articleData?.name || ""
    );
    const [articleQuantity, setArticleQuantity] = useState<string>(
        articleData?.quantity || ""
    );
    const [articleId, setArticleId] = useState<string>(articleData?.id || "");

    const { userId } = useRecoilValue(userState);
    const setIsLoading = useSetRecoilState(isArticleFetchingState);

    useEffect(() => {
        setArticleName(articleData?.name || "");
        setArticleQuantity(articleData?.quantity || "");
        setArticleId(articleData?.id || "");
    }, [articleData]);

    const articleModifier = useArticleModifier({
        name: articleName,
        quantity: articleQuantity,
        id: articleId,
        list: listId,
    });
    const { isLoading } = articleModifier;
    const isOnline = useRecoilValue(onlineStatusState);

    useEffect(() => {
        isLoading !== undefined && setIsLoading({ isLoadingState: isLoading });
    }, [isLoading, setIsLoading]);

    // useEffect(() => {
    //     isError && console.log("error$$$$$$$ : " + error);
    // },[isError, error])

    const articleDeleter = useArticleDeleter(articleId);

    const newArticleAdder = useNewArticleAdder({
        name: articleName,
        quantity: articleQuantity,
        isBuyed: false,
        addBy: userId,
        list: listId,
    });

    const handleModifieArticle = () => {
        articleModifier.mutateAsync();
    };

    const handleDeleteArticle = () => {
        articleDeleter.mutateAsync();
    };
    const handleAddNewArticle = () => {
        newArticleAdder.mutateAsync();
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
                            Vous êtes hors ligne, vous ne pouvez pas apporter de modifications.
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
                                value={articleName}
                                onChange={(e) => setArticleName(e.target.value)}
                            />
                            <label className="label">
                                <span className="label-text">Qté</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Quantitée"
                                className="input input-bordered w-full"
                                value={articleQuantity}
                                onChange={(e) =>
                                    setArticleQuantity(e.target.value)
                                }
                            />
                        </form>
                        {mode === "update" && (
                            <>
                                <label
                                    htmlFor="articleModal"
                                    className={`btn btn-primary mt-4 w-full ${!isOnline && "btn-disabled"}`}
                                    onClick={handleModifieArticle}
                                >
                                    Modifier
                                </label>
                                <div className="divider"></div>
                                <label
                                    htmlFor="articleModal"
                                    className={`btn btn-primary mt-4 w-full ${!isOnline && "btn-disabled"}`}
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
                                    onClick={handleAddNewArticle}
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
