/**
 * Standard HUD spacing from viewport edges
 * Ensures consistent padding across all HUD components
 */
export const HUD_SPACING = {
    mobile: 'p-4',      // 16px
    desktop: 'sm:p-6'   // 24px
} as const;

export const HUD_SPACING_CLASSES = `${HUD_SPACING.mobile} ${HUD_SPACING.desktop}`;
