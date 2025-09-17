import { useEffect, useState } from 'react';
import '../styles/Chat.scss'; 

const Loader = ({ hints = null }) => {
    const defaultHints = [
        "Scanning top headlines…",
        "Gathering insights from trusted sources…",
        "Analyzing trending stories and summaries…",
        "Picking the most relevant updates for you…"
    ];
    const items = hints && hints.length ? hints : defaultHints;
    const [hintIndex, setHintIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setHintIndex(prev => (prev + 1) % items.length);
        }, 2600);
        return () => clearInterval(id);
    }, [items.length]);

    return (
        <div className="message-wrapper assistant typing-indicator-wrapper" role="status" aria-live="polite">
            <div className="avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M19.5,11C17.7,11 16,12.7 16,14.5C16,16.3 17.7,18 19.5,18C21.3,18 23,16.3 23,14.5C23,12.7 21.3,11 19.5,11M9,14.5C9,12.7 7.3,11 5.5,11C3.7,11 2,12.7 2,14.5C2,16.3 3.7,18 5.5,18C7.3,18 9,16.3 9,14.5M16,21.5C16,19.7 14.3,18 12.5,18C10.7,18 9,19.7 9,21.5C9,23.3 10.7,25 12.5,25C14.3,25 16,23.3 16,21.5Z" />
                </svg>
            </div>

            <div className="typing-box">
                <div className="typing-dots" aria-hidden="true">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                </div>

                <p className="typing-hint">{items[hintIndex]}</p>

                <div className="skeleton-message" aria-hidden="true">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line long" />
                    <div className="skeleton-line medium" />
                </div>
            </div>
        </div>
    );
};

export default Loader;
