# vue-fabric-fiber

## 1.1.0

### Minor Changes

- [`402f3b1`](https://github.com/sonofmagic/vue-fabric-fiber/commit/402f3b1c017058621676f7eb6eed682a99ce1922) Thanks [@sonofmagic](https://github.com/sonofmagic)! - - `FabricCanvas` 新增 `displayWidth` / `displayHeight`（支持 `number | string`），用于在保持画布导出分辨率不变的前提下控制预览显示尺寸（CSS-only）。
  - 修复高分辨率画布在自定义显示尺寸后未刷新 offset 导致的绘制坐标错位（自动 `calcOffset`）。
  - 更新高分辨率绘图示例：补充橡皮工具兼容实现（无 `EraserBrush` 时回退到 `destination-out`）、调亮背景并更新画笔/橡皮指针以提高对比度与可用性。

## 1.0.4

### Patch Changes

- [`8fb894a`](https://github.com/sonofmagic/vue-fabric-fiber/commit/8fb894a14fe2613620672db3816aaa7e7a111145) Thanks [@sonofmagic](https://github.com/sonofmagic)! - chore: upgrade fabric to 6.9.1

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
