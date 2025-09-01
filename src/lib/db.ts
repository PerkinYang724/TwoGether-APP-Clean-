import { get, set } from 'idb-keyval'

export const db = {
    async get<T>(key: string, fallback: T): Promise<T> {
        const v = await get(key)
        return (v ?? fallback) as T
    },
    async set<T>(key: string, value: T) { return set(key, value) }
}
