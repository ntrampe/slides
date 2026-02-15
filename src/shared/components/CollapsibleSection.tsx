import { useState } from "react";

export interface CollapsibleSectionProps {
    title: string;
    defaultExpanded?: boolean;
    children: React.ReactNode;
}

export const CollapsibleSection = ({
    title,
    defaultExpanded = false,
    children,
}: CollapsibleSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-lg font-semibold mb-3 border-b border-border pb-2 hover:text-primary-500 transition-colors"
            >
                <span>{title}</span>
                <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isExpanded && <div className="space-y-4">{children}</div>}
        </div>
    );
};
