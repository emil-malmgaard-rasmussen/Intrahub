// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {ColorSchemeName} from 'react-native';

const THEME_ASYNC_STORAGE_KEY = 'THEME_STATE';

type Props = {
    children: ReactNode;
};

export type ThemeContextState = {
    theme: ColorSchemeName | undefined;
    setTheme: React.Dispatch<React.SetStateAction<ColorSchemeName | undefined>>;
    loading: boolean;
};

export const ThemeContext = React.createContext<ThemeContextState | undefined>(
    undefined,
);

export default function ThemeProvider({children}: Props) {
    const [theme, setTheme] = useState<ColorSchemeName | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // const loadTheme = async () => {
        //     try {
        //         const storedTheme = (await AsyncStorage.getItem(
        //             THEME_ASYNC_STORAGE_KEY,
        //         )) as ColorSchemeName | null;
        //         if (storedTheme) {
        //             setTheme(storedTheme);
        //         }
        //     } catch (error) {
        //         console.error('Failed to load theme:', error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        //
        // loadTheme();
    }, []);

    useEffect(() => {
        const saveTheme = async () => {
            // try {
            //     if (theme) {
            //         await AsyncStorage.setItem(THEME_ASYNC_STORAGE_KEY, theme);
            //     } else {
            //         await AsyncStorage.removeItem(THEME_ASYNC_STORAGE_KEY);
            //     }
            // } catch (error) {
            //     console.error('Failed to save theme:', error);
            // }
        };

        if (!loading) {
            saveTheme();
        }
    }, [theme, loading]);

    const contextState = useMemo(
        () => ({loading, setTheme, theme}),
        [theme, loading],
    );

    if (loading) {
        return null;
    }

    return (
        <ThemeContext.Provider value={contextState}>
            {children}
        </ThemeContext.Provider>
    );
}
