import { Lists, Article } from "../../types/dbPocketbasetypes";
import pb from "../../lib/pocketbase";
import ModalToModifieArticle from "./ModalToModifieArticle";
import { useEffect, useState } from "react";

// type TableProps = {
//     data: Lists;
// }

const Table: React.FC<Lists> = (data) => {
    const [articleData, setArticleData] = useState<Article | null>(null);
    const [articleLeft, setArticleLeft] = useState<number>(0);
    const [mode, setMode] = useState<"update" | "create">("update");

    const updateIsBuyed = async (id: string, data: boolean, listId: string) => {
        await pb
            .collection("articles")
            .update(id, { isBuyed: data })
            .then(
                await pb
                    .collection("lists")
                    .update(listId, { modifiedArticle: Date.now() })
            );
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
        checkArticleLeft(data?.expand.articles);
    }, [data]);

    return (
        <div>
            <h1>{data?.name}</h1>
            <progress
                className={`progress w-56 ${
                    articleLeft === 0 ? "progress-success" : ""
                }`}
                value={data?.expand.articles.length - articleLeft}
                max={data?.expand.articles.length}
            ></progress>
            <table className="table table-compact w-full">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Article</th>
                        <th>Qté</th>
                        <th>
                            <span className="countdown">
                                {/* eslint-disable-next-line */}
                                {/* @ts-ignore */}
                                <span style={{ "--value": articleLeft }}></span>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* rows */}
                    {data?.expand.articles.map((article) => {
                        return (
                            <tr key={article.id} className="hover">
                                <th className="w-0">
                                    <div className="flex-none">
                                        <label
                                            htmlFor="articleModal"
                                            onClick={() => {
                                                setMode("update");
                                                setArticleData({ ...article });
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
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={article.isBuyed}
                                            onChange={() => {
                                                updateIsBuyed(
                                                    article.id,
                                                    !article.isBuyed,
                                                    data.id
                                                );
                                            }}
                                        />
                                    </label>
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
            <label
                htmlFor="articleModal"
                onClick={() => {
                    setMode("create");
                    setArticleData(null);
                }}
                className="btn btn-square "
            >
                +
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <g fill="none">
                        <path
                            d="M24 16a3.5 3.5 0 1 1 0-7a3.5 3.5 0 0 1 0 7zm0 11.5a3.5 3.5 0 1 1 0-7a3.5 3.5 0 0 1 0 7zm-3.5 8a3.5 3.5 0 1 0 7 0a3.5 3.5 0 0 0-7 0z"
                            fill="currentColor"
                        ></path>
                    </g>
                </svg> */}
            </label>
            <ModalToModifieArticle
                articleData={articleData}
                listId={data.id}
                articlesList={data.articles}
                mode={mode}
            />
        </div>
    );
};
export default Table;
