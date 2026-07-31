export function getValueOrDefault<TKey, TValue>(map: Map<TKey, TValue>, key: TKey, defaultValue: TValue): TValue {
    return map.get(key) ?? defaultValue;
};

export function incrementValue<TKey>(map: Map<TKey, number>, key: TKey): void {
    const currentValue = getValueOrDefault(map, key, 0);
    map.set(key, currentValue + 1);
};

export function getMinValue<TKey>(map: Map<TKey, number>, keysSubSet: TKey[], defaultValue: number): number {
    if (map.size === 0) {
        return defaultValue;
    }

    const result = keysSubSet.map(key => getValueOrDefault(map, key, defaultValue)).reduce((a, b) => Math.min(a, b));
    return result;
}

export function getMaxValue<TKey>(map: Map<TKey, number>, keysSubSet: TKey[], defaultValue: number): number {
    if (map.size === 0) {
        return defaultValue;
    }

    const result = keysSubSet.map(key => getValueOrDefault(map, key, defaultValue)).reduce((a, b) => Math.max(a, b));
    return result;
}
