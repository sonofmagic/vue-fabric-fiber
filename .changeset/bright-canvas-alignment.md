---
"vue-fabric-fiber": minor
---

- `FabricCanvas` 新增 `displayWidth` / `displayHeight`（支持 `number | string`），用于在保持画布导出分辨率不变的前提下控制预览显示尺寸（CSS-only）。
- 修复高分辨率画布在自定义显示尺寸后未刷新 offset 导致的绘制坐标错位（自动 `calcOffset`）。
- 更新高分辨率绘图示例：补充橡皮工具兼容实现（无 `EraserBrush` 时回退到 `destination-out`）、调亮背景并更新画笔/橡皮指针以提高对比度与可用性。
