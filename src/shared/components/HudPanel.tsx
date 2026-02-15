import type { ReactNode } from 'react';

export type HudVariant = 'subtle' | 'standard' | 'prominent';
export type HudSize = 'display' | 'heading' | 'body' | 'caption';

interface HudPanelProps {
    children: ReactNode;
    variant?: HudVariant;
    className?: string;
}

const variantStyles: Record<HudVariant, string> = {
    subtle: 'bg-black/20 backdrop-blur-md border border-white/5',
    standard: 'bg-black/80 backdrop-blur-sm border border-white/10',
    prominent: 'bg-black/90 backdrop-blur-sm border border-white/20',
};

export const HudPanel = ({
    children,
    variant = 'subtle',
    className = ''
}: HudPanelProps) => {
    return (
        <div
            className={`
                ${variantStyles[variant]} 
                text-white rounded-2xl p-4 sm:p-6
                ${className}
            `.trim()}
        >
            {children}
        </div>
    );
};

// Responsive text size utilities
export const hudTextSizes: Record<HudSize, string> = {
    display: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    heading: 'text-xl sm:text-2xl md:text-3xl',
    body: 'text-base sm:text-lg md:text-xl',
    caption: 'text-sm sm:text-base',
};