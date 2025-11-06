/**
 * Normalise arbitrary arrays of values against a known whitelist.
 * @internal
 */
export function normalizeKeySelection<Key extends string>(
  values: readonly unknown[] | undefined,
  validKeys: ReadonlySet<Key>,
): Key[] {
  if (!values || values.length === 0) {
    return []
  }

  const result: Key[] = []
  for (const value of values) {
    if (typeof value === 'string' && validKeys.has(value as Key)) {
      result.push(value as Key)
    }
  }
  return result
}

/**
 * Pick a subset of defined properties from a partial record.
 * @internal
 */
export function pickDefinedProps<
  Source extends Record<string, any>,
  Keys extends readonly (keyof Source)[],
>(
  source: Partial<Source> | undefined,
  keys: Keys,
): Partial<Pick<Source, Keys[number]>> {
  if (!source) {
    return {}
  }

  const payload: Partial<Pick<Source, Keys[number]>> = {}
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined) {
      ;(payload as Record<string, any>)[key as string] = value
    }
  }
  return payload
}

/**
 * Extract a subset of keys from any record-like object, dropping undefined values.
 * @internal
 */
export function pickFromUnknown<
  Keys extends readonly string[],
  KeyUnion extends Keys[number] = Keys[number],
>(
  source: unknown,
  keys: Keys,
): Partial<Record<KeyUnion, unknown>> {
  if (!source) {
    return {}
  }

  const record = source as Record<string, unknown>
  const payload: Partial<Record<KeyUnion, unknown>> = {}
  for (const key of keys) {
    const value = record[key]
    if (value !== undefined) {
      payload[key as KeyUnion] = value
    }
  }
  return payload
}

/**
 * Utility to compose option picking with undefined stripping.
 * @internal
 */
export function pickDefinedOptions<
  Source extends Record<string, any>,
  Keys extends readonly (keyof Source)[],
>(
  source: Source | Partial<Source> | undefined,
  keys: Keys,
): Partial<Source> {
  if (!source) {
    return {}
  }

  return pickDefinedProps(source as Partial<Source>, keys) as Partial<Source>
}
