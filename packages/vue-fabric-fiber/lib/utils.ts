export function removeUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) {
    // 处理数组
    return obj
      // .map(item => removeUndefined(item))
      .filter((item): item is Exclude<typeof item, undefined> => item !== undefined) as unknown as T
  }
  else if (obj && typeof obj === 'object') {
    // 处理对象
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>)
        // .map(([key, value]) => [key, removeUndefined(value)])
        .filter(([_, value]) => value !== undefined),
    ) as T
  }
  return obj
}
