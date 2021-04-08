let nextId = 1

export const generateUniqueId = (): number => {
    return nextId++
}