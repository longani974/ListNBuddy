import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { useRecoilValue } from "recoil";
import { userState } from "./atoms/userAtoms";
import Table from "./components/Table/Table";
import useGetLastListAndRealTime from "./hooks/useGetLastListAndRealTime";
import pb from "./lib/pocketbase";
import Drawer from "./components/Drawer";

export default function App() {
    const { isLogin, userId } = useRecoilValue(userState);
    const { data } = useGetLastListAndRealTime();

    // console.log(data)

    const addNewArticle = async () => {
        const recordArticle = await pb.collection("articles").create({
            name: "lait",
            quantity: "1l",
            isBuyed: false,
            addBy: userId,
            isBuyedBy: "",
        });
        // .then(
        //     async (res) =>
        //         await pb.collection("lists").update(listId, {
        //             modifiedArticle: Date.now(),
        //             articles: [...articlesList, res.id],
        //         })
        // );
        return recordArticle;
    };

    const createList = async (articleId: string) => {
        console.log("createFirstList");
        // example create data
        const data = {
            name: "testali",
            createBy: userId,
            participants: [userId],
            articles: [articleId],
            modifiedArticle: "test",
        };

        const recordList = await pb.collection("lists").create(data);
        return recordList;
        // await addNewArticle(recordList.id);
    };

    const createFirstList = async () => {
        console.log("createFirstList");
        const article = await addNewArticle();
        await createList(article.id);
    };

    return (
        <>
            <Navbar />
            <Drawer />
            {/* <h1>Logged In: {isLogin.toString()}</h1> */}
            {!isLogin && <Auth />}

            {isLogin && (
                <div>
                    <div className="overflow-x-auto w-full">
                        {data ? (
                            <Table {...data} />
                        ) : (
                            <label
                                htmlFor="articleModal"
                                onClick={() => {
                                    createFirstList();
                                }}
                                className="btn"
                            >
                                Créer votre première liste
                            </label>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
