import React, { useEffect } from "react";
import { Article } from "../../types/dbPocketbasetypes";
import pb from "../../lib/pocketbase";
import { useMutation } from "@tanstack/react-query";

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
    articlesList,
}) => {
    const [articleName, setArticleName] = React.useState<string>(
        articleData?.name || ""
    );
    const [articleQuantity, setArticleQuantity] = React.useState<string>(
        articleData?.quantity || ""
    );
    const [articleId, setArticleId] = React.useState<string>(
        articleData?.id || ""
    );

    useEffect(() => {
        setArticleName(articleData?.name || "");
        setArticleQuantity(articleData?.quantity || "");
        setArticleId(articleData?.id || "");
    }, [articleData]);

    const updateArticle = async () => {
        await pb
            .collection("articles")
            .update(articleId, {
                name: articleName,
                quantity: articleQuantity,
            })
            .then(
                await pb
                    .collection("lists")
                    .update(listId, { modifiedArticle: Date.now() })
            );
    };
    const deleteArticle = async () => {
        await pb
            .collection("articles")
            .delete(articleId)
            .then(
                await pb
                    .collection("lists")
                    .update(listId, {
                        modifiedArticle: Date.now(),
                        articles: articlesList.filter(
                            (article) => article !== articleId
                        ),
                    })
            );
    };

    const addNewArticle = async () => {
        await pb
            .collection("articles")
            .create({
                name: articleName,
                quantity: articleQuantity,
                isBuyed: false,
                addBy: "6p39jij1dx51q5b",
                isBuyedBy: "",
            })
            .then(
                async (res) =>
                    await pb.collection("lists").update(listId, {
                        modifiedArticle: Date.now(),
                        articles: [...articlesList, res.id],
                    })
            );
    };

    const mutateArticle = useMutation(updateArticle);
    const mutateDeleteArticle = useMutation(deleteArticle);

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
                                    className="btn btn-primary mt-4"
                                    onClick={() => mutateArticle.mutate()}
                                >
                                    Modifier
                                </label>
                                <div className="divider"></div>
                                <label
                                    htmlFor="articleModal"
                                    className="btn btn-primary mt-4 w-full"
                                    onClick={() => mutateDeleteArticle.mutate()}
                                >
                                    Supprimer
                                </label>
                            </>
                        )}
                        {mode === "create" && (
                            <>
                                <label
                                    htmlFor="articleModal"
                                    className="btn btn-primary mt-4"
                                    onClick={() => addNewArticle()}
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
