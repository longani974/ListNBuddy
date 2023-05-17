import "./App.css";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import pb from "./lib/pocketbase";



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
