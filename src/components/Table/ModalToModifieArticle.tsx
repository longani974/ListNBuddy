import React, { useEffect } from "react";
import { Article } from "../../types/dbPocketbasetypes";
import pb from "../../lib/pocketbase";
import { useMutation } from "@tanstack/react-query";

// type ModalToModifieArticleProps = {
//     // props here
// };

const ModalToModifieArticle: React.FC<{
    articleData: Article | null;
    listId: string;
}> = ({ articleData, listId }) => {
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

    const updateArticle = async () =>
        // id: string,
        // data: { name: string; quantity: string },
        // listId: string
        {
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
        const mutateArticle = useMutation(updateArticle);

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
                            <label
                                htmlFor="articleModal"
                                className="btn btn-primary mt-4"
                                onClick={() => mutateArticle.mutate()}
                            >
                                Modifier
                            </label>
                        </form>
                        <div className="divider"></div>
                        <label
                            htmlFor="articleModal"
                            className="btn btn-primary mt-4 w-full"
                            onClick={() => mutateArticle.mutate()}
                        >
                            Supprimer
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ModalToModifieArticle;
