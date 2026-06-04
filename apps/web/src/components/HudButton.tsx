import type { ReactNode } from 'react';

interface HudButtonProps {
    onClick: () => void;
    children: ReactNode;
    label: string;
    className?: string;
    size?: 'small' | 'medium' | 'large';
}

const sizeStyles = {
    small: 'p-2 [&_svg]:w-5 [&_svg]:h-5',
    medium: 'p-2 sm:p-3 [&_svg]:w-6 [&_svg]:h-6 sm:[&_svg]:w-7 sm:[&_svg]:h-7',
    large: 'p-3 sm:p-4 [&_svg]:w-10 [&_svg]:h-10 sm:[&_svg]:w-12 sm:[&_svg]:h-12',
};

export const HudButton = ({
    onClick,
    children,
    label,
    className = '',
    size = 'medium'
}: HudButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`
                text-white hover:bg-white/20 active:bg-white/30
                rounded-full transition-all duration-300
                ${sizeStyles[size]}
                ${className}
            `.trim()}
            aria-label={label}
        >
            {children}
        </button>
    );
};