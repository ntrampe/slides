import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

interface VisibilityContextValue {
    isVisible: boolean;
    isHidden: boolean;
}

const VisibilityContext = createContext<VisibilityContextValue | undefined>(
    undefined
);

interface VisibilityProviderProps {
    children: ReactNode;
}

export const VisibilityProvider = ({
    children,
}: VisibilityProviderProps) => {
    const [isVisible, setIsVisible] = useState(
        document.visibilityState === "visible"
    );

    useEffect(() => {
        const handleVisibility = () => {
            setIsVisible(document.visibilityState === "visible");
        };

        const handleFocus = () => setIsVisible(true);
        const handleBlur = () => setIsVisible(false);

        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

    return (
        <VisibilityContext.Provider
            value={{
                isVisible,
                isHidden: !isVisible,
            }}
        >
            {children}
        </VisibilityContext.Provider>
    );
};

export const useVisibility = () => {
    const context = useContext(VisibilityContext);
    if (!context) {
        throw new Error("useVisibility must be used within VisibilityProvider");
    }
    return context;
};