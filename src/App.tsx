import "./App.css";
import Navbar from "./components/Navbar";
import PocketBase from "pocketbase";
import Auth from "./components/Auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const pb = new PocketBase("http://127.0.0.1:8090");

// Create a client
const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
        <Navbar />
            <h1>Logged In: {pb.authStore.isValid.toString()}</h1>
            {!pb.authStore.isValid && <Auth />}
        </QueryClientProvider>
    );
}
