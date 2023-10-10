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
    }, []);

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
