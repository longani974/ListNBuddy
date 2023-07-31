import { Lists, Article } from "../../types/dbPocketbasetypes";
import ModalToModifieArticle from "./ModalToModifieArticle";
import { useEffect, useState } from "react";
import { useArticleModifier } from "../../hooks/useArticleModifier";
import { articlesState } from "../../atoms/articlesAtoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ModalInviteUser from "./ModalInviteUser";
import pb from "../../lib/pocketbase";
import ErrorToast from "../ErrorToast";

const Table: React.FC<Lists> = (data) => {
    const [articleData, setArticleData] = useState<Article | null>(null);
    const [articleLeft, setArticleLeft] = useState<number>(0);
    const [mode, setMode] = useState<"update" | "create">("update");
    // const [articles, setArticles] = useState<Article[]>([]);
    const { articles } = useRecoilValue(articlesState);
    const setArticles = useSetRecoilState(articlesState);

    const articleModifier = useArticleModifier({
        id: articleData?.id as string,
        isBuyed: articleData?.isBuyed,
        isBuyedBy: articleData?.isBuyedBy,
        quantity: articleData?.quantity,
        name: articleData?.name,
    });

    const { isError, isLoading } = articleModifier;

    const updateIsBuyed = () => {
        articleModifier.mutateAsync();
    };

    const checkArticleLeft = (articles: Article[]) => {
        let articleLeft = 0;

        articles.forEach((article) => {
            if (!article.isBuyed) {
                articleLeft++;
            }
        });

        setArticleLeft(articleLeft);
    };

    useEffect(() => {
        articles.length && checkArticleLeft(articles);
    }, [articles]);

    useEffect(() => {
        // Get records from the collection "articles" filtered  list = data.id
        // TODO: use react-query
        pb.collection("articles")
            .getFullList({ filter: `list = "${data.id}"` })
            .then((res) => {
                setArticles({ articles: res as Article[] });
            });
        // !!!! WARNING !!!! we desactivate the eslint rule because eslint want to put setArticles in the dependency array
        // but it's not a good idea because it will create an infinite loop
        // https://github.com/facebookexperimental/Recoil/issues/661
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.id]);

    return (
        <>
            {isError && (
                <ErrorToast
                    message={
                        articleData?.isBuyed
                            ? `Impossible de passer ${articleData.name} comme acheté(e).\nVérifiez votre connexion internet.`
                            : `Impossible de passer ${articleData?.name} comme non acheté(e).\nVérifiez votre connexion internet.`
                    }
                />
            )}
            <div>
                <div className="w-full relative">
                    <h1>{data?.name}</h1>
                    {!!articles?.length && (
                        <progress
                            className={`progress w-56 ${
                                articleLeft === 0 ? "progress-success" : ""
                            }`}
                            value={articles?.length - articleLeft}
                            max={articles?.length}
                        ></progress>
                    )}
                    <div className="w-full absolute z-10 top-0 flex justify-end">
                        <label
                            htmlFor="inviteUserModal"
                            onClick={() => {
                                setMode("create");
                                setArticleData(null);
                            }}
                            className="btn btn-square btn-ghost p-2 ml-auto"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g fill="none">
                                    <path
                                        d="M17.5 12a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11zm0 2l-.09.007a.5.5 0 0 0-.402.402L17 14.5V17L14.498 17l-.09.008a.5.5 0 0 0-.402.402l-.008.09l.008.09a.5.5 0 0 0 .402.402l.09.008H17v2.503l.008.09a.5.5 0 0 0 .402.402l.09.008l.09-.008a.5.5 0 0 0 .402-.402l.008-.09V18l2.504.001l.09-.008a.5.5 0 0 0 .402-.402l.008-.09l-.008-.09a.5.5 0 0 0-.403-.402l-.09-.008H18v-2.5l-.008-.09a.5.5 0 0 0-.402-.403L17.5 14zm-3.246-4c.835 0 1.563.454 1.951 1.13a6.44 6.44 0 0 0-1.518.509a.736.736 0 0 0-.433-.139H9.752a.75.75 0 0 0-.75.75v4.249c0 1.41.974 2.594 2.286 2.915a6.42 6.42 0 0 0 .735 1.587l-.02-.001a4.501 4.501 0 0 1-4.501-4.501V12.25A2.25 2.25 0 0 1 9.752 10h4.502zm-6.848 0a3.243 3.243 0 0 0-.817 1.5H4.25a.75.75 0 0 0-.75.75v2.749a2.501 2.501 0 0 0 3.082 2.433c.085.504.24.985.453 1.432A4.001 4.001 0 0 1 2 14.999V12.25a2.25 2.25 0 0 1 2.096-2.245L4.25 10h3.156zm12.344 0A2.25 2.25 0 0 1 22 12.25v.56A6.478 6.478 0 0 0 17.5 11l-.245.005A3.21 3.21 0 0 0 16.6 10h3.15zM18.5 4a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM12 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6zM5.5 4a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zm13 1.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-6.5-1a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zm-6.5 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2z"
                                        fill="currentColor"
                                    ></path>
                                </g>
                            </svg>
                        </label>
                    </div>

                    <table className="table table-sm w-full">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Article</th>
                                <th>Qté</th>
                                <th>
                                    <span className="countdown">
                                        <span
                                            style={{
                                                /* eslint-disable-next-line */
                                                /* @ts-ignore */
                                                "--value": articles?.length
                                                    ? articleLeft
                                                    : 0,
                                            }}
                                        ></span>
                                        {/* prettier-ignore */}
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* rows */}
                            {!!articles?.length &&
                                articles?.map((article) => {
                                    return (
                                        <tr key={article.id} className="hover:bg-base-200">
                                            <th className="w-0">
                                                <div className="flex-none">
                                                    <label
                                                        htmlFor="articleModal"
                                                        onClick={() => {
                                                            setMode("update");
                                                            setArticleData(
                                                                article
                                                            );
                                                        }}
                                                        className="btn btn-square btn-ghost w-6 "
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 48 48"
                                                        >
                                                            <g fill="none">
                                                                <path
                                                                    d="M24 16a3.5 3.5 0 1 1 0-7a3.5 3.5 0 0 1 0 7zm0 11.5a3.5 3.5 0 1 1 0-7a3.5 3.5 0 0 1 0 7zm-3.5 8a3.5 3.5 0 1 0 7 0a3.5 3.5 0 0 0-7 0z"
                                                                    fill="currentColor"
                                                                ></path>
                                                            </g>
                                                        </svg>
                                                    </label>
                                                </div>
                                            </th>
                                            <td>
                                                {article.name}
                                                <br />
                                                {/* <span className="badge badge-ghost badge-sm">
                    Community Outreach Specialist
                </span> */}
                                            </td>
                                            <td>{article.quantity}</td>
                                            <th>
                                                {isLoading &&
                                                article.id ===
                                                    articleData?.id ? (
                                                    <span>"loading"</span>
                                                ) : (
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox"
                                                            checked={
                                                                article.isBuyed
                                                            }
                                                            onChange={() => {
                                                                const articleChange =
                                                                    {
                                                                        ...article,
                                                                    } as Article;
                                                                articleChange.isBuyed =
                                                                    !article.isBuyed;
                                                                setArticleData(
                                                                    articleChange
                                                                );
                                                                updateIsBuyed();
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                            </th>
                                        </tr>
                                    );
                                })}
                        </tbody>
                        {/* foot */}
                        {/* <tfoot>
        <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
            <th></th>
        </tr>
    </tfoot> */}
                    </table>
                    <div className="flex justify-end">
                        <label
                            htmlFor="articleModal"
                            onClick={() => {
                                setMode("create");
                                setArticleData(null);
                            }}
                            className="btn btn-square btn-ghost p-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M14 10H3v2h11v-2zm0-4H3v2h11V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM3 16h7v-2H3v2z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </label>
                    </div>
                </div>

                <ModalToModifieArticle
                    articleData={articleData}
                    listId={data.id}
                    articlesList={data.articles}
                    mode={mode}
                />

                <ModalInviteUser listId={data.id} />
            </div>
        </>
    );
};
export default Table;
