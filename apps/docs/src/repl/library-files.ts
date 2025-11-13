const libraryModules = import.meta.glob<string>(
  '../../../../packages/vue-fabric-fiber/lib/**/*.ts',
  {
    as: 'raw',
  },
)

let libraryFilesPromise: Promise<Record<string, string>> | null = null

function normalizePath(path: string) {
  const sanitizedPath = path.replace(/\\/g, '/')
  const [, relative] = sanitizedPath.split('/lib/')
  if (!relative) {
    throw new Error(`Unable to derive library path from ${path}`)
  }
  return `vue-fabric-fiber/${relative}`
}

export function loadLibraryFiles() {
  if (!libraryFilesPromise) {
    libraryFilesPromise = Promise.all(
      Object.entries(libraryModules).map(async ([path, loader]) => {
        const code = await loader()
        return [normalizePath(path), code] as const
      }),
    ).then(entries => Object.fromEntries(entries))
  }

  return libraryFilesPromise
}
