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
        if (window.adsbygoogle.length === 0) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
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
