import { Heart } from 'lucide-react';

export interface SupportButtonProps {
    url: string;
    text: string;
    className?: string;
}

export const SupportButton = ({ url, text, className = '' }: SupportButtonProps) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                inline-flex items-center gap-2 px-4 py-2 
                bg-primary-500 hover:bg-primary-600 
                text-white font-medium rounded-lg
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background
                ${className}
            `}
        >
            <Heart size={16} className="text-red-300" />
            <span>{text}</span>
        </a>
    );
};