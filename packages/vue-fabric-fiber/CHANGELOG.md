# vue-fabric-fiber

## 1.1.0

### Minor Changes

- [`3396763`](https://github.com/sonofmagic/vue-fabric-fiber/commit/3396763103fd2d7360ac2f936fe0a1e6bc243b9f) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Add structured `position` support with per-axis px/% units for Fabric bindings and update the PDF watermark demo to show and edit both pixel and percentage offsets.

- [`1984ddc`](https://github.com/sonofmagic/vue-fabric-fiber/commit/1984ddc37868277a90c17d4ca7f9c75052eb71f4) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Add origin-aware percent offsets to v-model snapshots and simplify the PDF watermark demo to bind X/Y percent directly from emitted `leftPercent`/`topPercent` values.

## 1.0.3

### Patch Changes

- [`bfa3556`](https://github.com/sonofmagic/vue-fabric-fiber/commit/bfa3556dd7e78586342a39dcae3cf3bb450bb52a) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Add a `stackOrder` prop so Fabric objects keep template ordering without `RenderGroup`, and update the PDF watermark demo/docs to showcase the new stacking flow.

## 1.0.2

### Patch Changes

- [`c7102ae`](https://github.com/sonofmagic/vue-fabric-fiber/commit/c7102ae939849c6b0b49e0d7493905370e340b89) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Fix PDF watermark overlay so it aligns top-left while rotating around its center and keep Fabric image origins applied; refresh docs demo styles and typings alongside canonical Tailwind variable classes.

## 1.0.1

### Patch Changes

- [`557c96a`](https://github.com/sonofmagic/vue-fabric-fiber/commit/557c96a79daa7a8b043c8512211ef3668ff37032) Thanks [@sonofmagic](https://github.com/sonofmagic)! - set FabricCanvas default pixel ratio to 1 and expose a helper for opting into the system pixel ratio

## 1.0.0

### Major Changes

- [`3fc819c`](https://github.com/sonofmagic/vue-fabric-fiber/commit/3fc819cfe7d59a7337bb456436fe6dfa7c4e0f25) Thanks [@sonofmagic](https://github.com/sonofmagic)! - chore: release 1.x version
