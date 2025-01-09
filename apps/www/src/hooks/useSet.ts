import { useCallback, useMemo, useState } from "react";

export interface StableActions<K> {
	add: (key: K) => void;
	remove: (key: K) => void;
	toggle: (key: K) => void;
	reset: () => void;
	clear: () => void;
	pop: () => void;
	shift: () => void;
}

export interface Actions<K> extends StableActions<K> {
	has: (key: K) => boolean;
}

const useSet = <K>(
	initialSet = new Set<K>(),
	onChange?: (nextSet: Set<K>) => void,
): [Set<K>, Actions<K>] => {
	const [set, setSet] = useState(initialSet);

	const handleSetChange = useCallback(
		(newSet: Set<K>) => {
			setSet(newSet);
			onChange?.(newSet);
		},
		[onChange],
	);

	const stableActions = useMemo<StableActions<K>>(() => {
		const add = (item: K) =>
			handleSetChange(new Set([...Array.from(set), item]));
		const remove = (item: K) =>
			handleSetChange(new Set(Array.from(set).filter((i) => i !== item)));
		const toggle = (item: K) =>
			handleSetChange(
				set.has(item)
					? new Set(Array.from(set).filter((i) => i !== item))
					: new Set([...Array.from(set), item]),
			);
		const pop = () => handleSetChange(new Set(Array.from(set).slice(0, -1)));
		const shift = () => handleSetChange(new Set(Array.from(set).slice(1)));

		return {
			add,
			remove,
			toggle,
			reset: () => handleSetChange(initialSet),
			clear: () => handleSetChange(new Set()),
			shift,
			pop,
		};
	}, [set, handleSetChange, initialSet]);

	const utils = {
		has: useCallback((item) => set.has(item), [set]),
		...stableActions,
	} as Actions<K>;

	return [set, utils];
};

export default useSet;
