import { useEffect, useState } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePref = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'preferred-theme';

let preferredTheme: ThemePref = 'system';
let hasLoadedPreferredTheme = false;
const listeners = new Set<() => void>();

async function loadPreferredTheme() {
	if (hasLoadedPreferredTheme) {
		return;
	}

	try {
		const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
		if (storedValue === 'light' || storedValue === 'dark' || storedValue === 'system') {
			if (preferredTheme !== storedValue) {
				preferredTheme = storedValue;
				listeners.forEach((listener) => listener());
			}
		}
	} catch {
		// ignore AsyncStorage errors and continue using the default theme
	} finally {
		hasLoadedPreferredTheme = true;
	}
}

export function setPreferredTheme(value: ThemePref) {
	preferredTheme = value;
	try {
		AsyncStorage.setItem(STORAGE_KEY, value);
	} catch {
		// ignore storage write errors
	}
	listeners.forEach((listener) => listener());
}

export function getPreferredTheme(): ThemePref {
	return preferredTheme;
}

export function addThemeChangeListener(cb: () => void) {
	listeners.add(cb);
	return () => removeThemeChangeListener(cb);
}

export function removeThemeChangeListener(cb: () => void) {
	listeners.delete(cb);
}

export function useColorScheme() {
	const systemScheme = _useColorScheme() ?? 'light';
	const [, setTick] = useState(0);

	useEffect(() => {
		const listener = () => setTick((tick) => tick + 1);
		const unsubscribe = addThemeChangeListener(listener);

		if (!hasLoadedPreferredTheme) {
			void loadPreferredTheme();
		}

		return () => unsubscribe();
	}, []);

	return preferredTheme === 'system' ? systemScheme : preferredTheme;
}

export default useColorScheme;
