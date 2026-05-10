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

## Phase 3 设计决策

### 用户流程（Meeting 确定）
```
首页 → Tour详情 → 加入购物车(选日期+人数) → 购物车 → 结算(预填联系信息) → 订单完成
                                                                                ↓
Tour详情底部 ← ← ← ← ← ← ← ← ← ← ← ← 添加评价(Review)
```

### 新增功能
- **购物车（Cart）**：CRUD — 加入、查看、修改、删除。后端组员在做
- **Review 评价**：展示在 Tour 详情页底部，需要新建后端接口
- **用户资料更新**：PUT /api/users/profile，需要新建后端接口

### 图片存储策略
- **静态素材**（登录背景、logo）→ `frontend/public/`，跟随代码部署
- **动态上传的 Tour 图片** → Cloudinary 云存储（后端已配置，controller 待切换）

### 后端接口依赖

| 接口 | 状态 | 负责人 |
|------|------|------|
| Cart CRUD（POST/GET/PUT/DELETE） | 组员开发中 | 组员 |
| Review（POST/GET） | 未开始 | 待定 |
| User Profile 更新（PUT） | 未开始 | 待定 |
| Tour Controller 切换 Cloudinary | 未开始 | 待定 |

---

## 待定事项

| 事项 | 状态 | 备注 |
|------|------|------|
| 2 个新功能 | 未确定 | AI tour 推荐是候选 |
| 设计图修复 | 未开始 | BDD 缺 Auth、CRUD 缺 Read、Use Case 错位 |
| 新 MongoDB Atlas 实例 | 延后 | 当前用 A1 的 |
| 搜索/筛选功能 | 延后 | 首页搜索栏目前是占位 |

---

## 设计模式要求（Meeting 确定）

| 模式 | 应用场景 | 状态 |
|------|------|------|
| Factory | 待定 | ⬜ |
| Singleton | 数据库连接 | ⬜ |
| Observer | 购物车状态变化通知 | ⬜ |
| Strategy | 待定 | ⬜ |
| Facade | API 抽象层 | ⬜ |
| MVC | 整体架构 | ✅ 已有 |
