import { useEffect } from "react";

interface AdSenseProps {
    slot: string;
    format: string;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

const AdSense = ({ slot, format }: AdSenseProps) => {
    useEffect(() => {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log("window.adsbygoogle")
            console.log(window.adsbygoogle)
    }, []);

    if (process.env.NODE_ENV === "development") {
        console.log("development");
        return <div>Adsense Bloc</div>;
    }

    return (
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-1943996794458760"
                data-ad-slot={slot}
                data-ad-format={format}
            />
    );
};

export default AdSense;
