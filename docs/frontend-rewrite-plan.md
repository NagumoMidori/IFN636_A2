# Frontend Rewrite Plan — 总进度

## 设计风格

- **C 端（用户端）**：Airbnb 风格 — 白底、卡片网格、圆角阴影、清晰排版
- **B 端（管理端）**：PandaDoc Dashboard 风格 — 白色侧边栏、zinc-50 主体、表格数据驱动、明亮简约
- **通用**：桌面端为主 + 响应式适配移动端，Inter 字体，emerald 品牌色

---

## Phase 1 — C 端核心页面 ✅ DONE

| 页面 | 路由 | 状态 |
|------|------|------|
| 公开首页（tour 卡片网格） | `/` | ✅ |
| 登录 | `/login` | ✅ |
| 注册 | `/register` | ✅ |
| Navbar（桌面全宽） | 全局 | ✅ |
| Footer（极简版权） | PublicLayout | ✅ |

**同步完成的基础架构：**
- PublicLayout / AuthLayout / AdminLayout 三套布局
- ProtectedRoute 路由守卫
- 旧路由全部迁移（`/tour/` → `/tours/`，admin 路由 → `/admin/*`）
- Tailwind design tokens（brand 色系、Inter 字体）

---

## Phase 2 — B 端 Admin 页面 ✅ DONE

| 页面 | 路由 | 状态 |
|------|------|------|
| Admin Dashboard（统计卡片 + 表格） | `/admin` | ✅ |
| AdminLayout 侧边栏导航 | `/admin/*` | ✅ |
| Tour 列表页（全部 tour 表格） | `/admin/tours` | ✅ |
| 添加新 Tour 表单 | `/admin/tours/new` | ✅ |
| 编辑 Tour 表单 | `/admin/tours/:id/edit` | ✅ |
| 订单列表页 | `/admin/orders` | ✅ |
| 订单详情页（新增） | `/admin/orders/:id` | ✅ |

**Phase 2 完成事项：**
- 路由调整：`/admin/tours` 改为 tour 列表，`/admin/tours/new` 为添加入口
- 订单状态三色统一：Confirmed（绿）/ Pending（琥珀）/ Cancelled（红）
- 所有表格统一 `table-fixed` + `colgroup` 对齐
- 表单统一 `max-w-5xl`，zinc-50 输入框 + emerald focus ring
- 新增订单详情页（AdminOrderDetail），表格行可点击查看

---

## Phase 3 — C 端剩余页面 🔄 待重新设计

| 页面 | 路由 | 状态 |
|------|------|------|
| Tour 详情 | `/tours/:id` | ⬜ 从 420px 改桌面端 |
| 预订 Tour | `/book-tour/:id` | ⬜ |
| 支付确认 | `/payment` | ⬜ |
| 我的预订 | `/my-bookings` | ⬜ |
| 编辑预订 | `/edit-booking/:id` | ⬜ |
| 取消预订 | `/cancel-booking/:id` | ⬜ |
| 用户 Dashboard | `/dashboard` | ⬜ |

---

## 待定事项

| 事项 | 状态 | 备注 |
|------|------|------|
| 2 个新功能 | 未确定 | AI tour 推荐是候选 |
| 设计图修复 | 未开始 | BDD 缺 Auth、CRUD 缺 Read、Use Case 错位 |
| 新 MongoDB Atlas 实例 | 延后 | 当前用 A1 的 |
| 搜索/筛选功能 | 延后 | 首页搜索栏目前是占位 |
