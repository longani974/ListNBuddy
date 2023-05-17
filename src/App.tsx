import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { userState } from "./atoms/userAtoms";

// Create a client
const queryClient = new QueryClient();

export default function App() {
    const {isLogin} = useRecoilValue(userState);
    return (
            <QueryClientProvider client={queryClient}>
                <Navbar />
                <h1>Logged In: {isLogin.toString()}</h1>
                {!isLogin && <Auth />}
            </QueryClientProvider>
    );
}
