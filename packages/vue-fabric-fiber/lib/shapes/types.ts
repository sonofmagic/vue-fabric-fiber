export type FabricObjectModel<T, ExtraOmit extends keyof T = never> = Partial<
  Omit<T, 'clipPath' | 'canvas' | ExtraOmit>
>
