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
                    <ul>
                        {data?.expand.articles.map((article) => (
                            <li key={article.id}>{article.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}
