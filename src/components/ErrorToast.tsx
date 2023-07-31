import React, { useEffect, useState } from "react";

type ErrorToastProps = {
    message: string;
    delay?: number;
};

const ErrorToast: React.FC<ErrorToastProps> = ({ message, delay }) => {
    const [hideAfterDelay, setHideAfterDelay] = useState(false);
    const [progress, setProgress] = useState(0);


    useEffect(() => {
        const timer = setTimeout(() => {
            setHideAfterDelay(true);
        }, delay || 5000);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        // Make a fluid progress bar that goes from 0 to 100% in delay seconds or 5 seconds by default
        const defaultDelay = delay || 5000;
        const interval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 100/(defaultDelay/50)));
        }
        , 50);
        return () => clearInterval(interval);
      }, [delay]);

    return hideAfterDelay ? null : (
        <div className="toast z-50">
            <div className="alert shadow-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <span className="whitespace-pre-line">{message}</span>
                <progress className="progress w-56" value={progress} max="100"></progress>
            </div>
        </div>
    );
};
export default ErrorToast;
