import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { useRecoilValue } from "recoil";
import { userState } from "./atoms/userAtoms";
import useGetList from "./hooks/useGetList";

export default function App() {
    const { isLogin } = useRecoilValue(userState);

    const { data } = useGetList();

    return (
        <>
            <Navbar />
            {/* <h1>Logged In: {isLogin.toString()}</h1> */}
            {!isLogin && <Auth />}

            {isLogin && (
                <div>
                    <h1>{data?.name}</h1>
                    {/* <ul>
                        {data?.expand.articles.map((article) => (
                            <li key={article.id}>{article.name}</li>
                        ))}
                    </ul> */}

                    <div className="overflow-x-auto w-full">
                        <table className="table w-full">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Article</th>
                                    <th>Qté</th>
                                    {/* <th>
                                        <label>
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                            />
                                        </label>
                                    </th> */}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* rows */}
                                {data?.expand.articles.map((article) => (
                                        <tr key={article.id}>
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
                                                        checked={
                                                            article.isBuyed
                                                        }
                                                        onChange={() => {console.log("changed")}}
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
                    </div>
                </div>
            )}
        </>
    );
}
