import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { useRecoilValue } from "recoil";
import { userState } from "./atoms/userAtoms";
import Table from "./components/Table";
import useGetLastListAndRealTime from "./hooks/useGetLastListAndRealTime";

export default function App() {
    const { isLogin } = useRecoilValue(userState);
    const { data } = useGetLastListAndRealTime();

    // console.log(data)

    return (
        <>
            <Navbar />
            {/* <h1>Logged In: {isLogin.toString()}</h1> */}
            {!isLogin && <Auth />}

            {isLogin && (
                <div>
                    {/* <h1>{data?.name}</h1> */}

                    <div className="overflow-x-auto w-full">
                        {data && <Table {...data} />}
                    </div>
                </div>
            )}
        </>
    );
}
