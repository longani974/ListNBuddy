import { useEffect } from "react";

interface AdSenseProps {
    slot: string;
    format: string;
    currentPath: string;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

const AdSense = ({ slot, format, currentPath }: AdSenseProps) => {
    useEffect(() => {

        (window.adsbygoogle = window.adsbygoogle || []).push({});

        console.log(window.adsbygoogle)

    }, []);

    if (process.env.NODE_ENV === "development") {
        console.log("development");
        return <div>Adsense Bloc</div>;
    }

    return (
        <div key={currentPath} className=" w-8 min-w-full ">
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-1943996794458760"
                data-ad-slot={slot}
                data-ad-format={format}
            />
        </div>
    );
};

export default AdSense;
