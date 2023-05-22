import { Lists } from "../types/dbPocketbasetypes";
import pb from "../lib/pocketbase";

// type TableProps = {
//     data: Lists;
// }

const Table: React.FC<Lists> = (data) => {


    const updateIsBuyed = async (id: string, data: boolean) => {
        await pb
            .collection("articles")
            .update(id, { isBuyed: data })
            .then(
                await pb
                    .collection("lists")
                    .update("fruv4feowetokkn", { modifiedArticle: Date.now() })
            );
    };

    return (
        <table className="table w-full">
            {/* head */}
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Qté</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {/* rows */}
                {data?.expand.articles.map((article) => (
                    <tr key={article.id} className="hover">
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
                                            !article.isBuyed
                                        );
                                    }}
                                />
                            </label>
                        </th>
                    </tr>
                ))}
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
    );
};
export default Table;
