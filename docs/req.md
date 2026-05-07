# IFN636 Assessment 2 — 需求汇总

**课程:** IFN636 Software Life Cycle Management  
**评估名称:** Software development, testing and configuration  
**截止日期:** 2026-05-22 (Fri) 23:59，48 小时宽限期至 2026-05-24 23:59  
**总分:** 35 分（占期末成绩 35%）  
**形式:** 小组作业（最多 4 人），提交单个 PDF 文件  
**演示:** Week 13 tutorial session 进行小组展示，不展示则不打分，展示表现影响最终报告评分

---

## 总体要求

- 从 Assessment 1 中各组员选过的项目中选一个，协作开发
- 在原有项目基础上**至少新增两个功能**
- 必须报告 Gen-AI 工具的使用情况（绘图、设计、文档、调试等），未报告视为学术诚信违规
- 提交文件须注明学生姓名、学号、组员信息

---

## 1. SRS Documentation（4 分）

### 交付物

1. **1.1 Project Overview and Purpose** — 项目简介：应用名称、核心目的、解决的问题、主要功能、目标用户
2. **1.2 Problem Statement and Scope** — 问题定义与范围：明确问题、项目范围内包含/排除的内容
3. **1.3 User Characteristics** — 用户特征：用户角色（如教师、学生、管理员）、技术水平、可访问性考虑
4. **1.4 Constraints** — 约束条件：技术、业务、法规等限制
5. **1.5 Functional Requirements** — 功能需求：格式为 "The system shall..."，编号如 FR-01, FR-02
6. **1.6 Non-Functional Requirements** — 非功能需求：性能、安全、可用性、可靠性、可维护性，尽量量化
7. **1.7 User Interface Mockups / Wireframes** — 低保真设计：至少包含首页、数据录入/表单页、仪表盘/结果页，标注所有 UI 元素
8. **1.8 Complete System Diagram** — 系统架构图：包含前端、后端、GitHub、数据库、云服务（EC2、负载均衡器）、外部 API，用箭头标注数据流

### HD 标准

- 详细、清晰的 SRS，全面阐述目的，令人信服的问题定义，解决真实需求
- 全面的系统边界描述（功能、包含/排除项）
- 明确定义的用户角色、技能水平和可访问性考虑
- 完整的功能/非功能需求，标注清晰的系统概览图
- 全面的系统安全覆盖（数据保护、错误处理、恢复机制）
- 结构良好的风险识别（可能性、影响评估、缓解策略）

---

## 2. Design Pattern and OOP Principles（6 分）

### 交付物

1. **2.1 Design Patterns** — 至少实现 **5 个设计模式**
   - 每个模式提供具体的后端代码截图
   - 说明选择该模式的理由（justification）
2. **2.2 OOP Principles** — 展示 OOP 概念的实现
   - 提供具体的后端代码截图
   - 对每个 OOP 原则进行说明和论证

### HD 标准

- 正确使用 5 个设计模式，配合强 OOP 概念，解释清晰
- 包含具体后端代码，并为每个设计模式和 OOP 原则提供选择理由

---

## 3. API Testing using Postman（2.5 分）

### 交付物

- 对后端代码的 API Request Collections 和 Response 提供截图
- 提供导出的 API collections 链接

### HD 标准

- 所有端点均已测试，包含错误处理
- 提供截图和导出 API collections 的链接

---

## 4. Functional Testing（2.5 分）

### 交付物

- 对每个后端功能（如 create, update, delete, fetch）在终端提供 pass/fail 截图
- 包含每个功能测试的 **测试用例表**，列包含：
  - Test Case ID
  - Expected Output
  - Actual Output

### HD 标准

- 提供所有后端功能的终端 pass/fail 截图
- 包含全面的测试用例表，列定义清晰

---

## 5. CI/CD Pipeline（4 分）

### 交付物

1. **5.1** Workflow 文件（YML）截图
2. **5.2** EC2 服务器配置截图（仅包含终端的 pm2 status 输出表）
3. **5.3** GitHub "Run Test" 页面截图（显示 job 运行状态，steps 的 pass/fail）
4. **5.4** 浏览器中应用首页截图，**高亮显示 public IP**

### HD 标准

- 使用 GitHub Actions 实现完全自动化的部署流水线
- 文档中清晰提供 instance 链接
- pm2 status 输出确认后端和前端在线运行
- 项目可通过工作的公共 URL 访问
- 所有组件集成并按预期运行

---

## 6. Load Balancing and Load Testing（6 分）

### 6.1 Load Balancer Setup — 交付物

将应用部署到**两个独立的 EC2 实例**，配置 AWS Application Load Balancer (ALB)：

- **(a)** 两个 EC2 实例均为 Running 状态的截图（AWS EC2 Instances 控制台）
- **(b)** Target Group 截图，显示两个实例已注册且状态健康（Status: healthy）
- **(c)** ALB 为 Active 状态的截图，显示其 DNS name
- **(d)** 流量分发确认截图：多次访问 ALB DNS（浏览器或 curl），捕获响应在两个服务器实例间交替

### 6.2 Load Testing and Performance Analysis — 交付物

使用负载测试工具（如 Apache Benchmark），至少运行 **两次不同参数的测试** 并比较：

- **(a)** 基线测试的 Apache Benchmark 输出截图，识别并解释关键指标：Requests per second、Time per request、Failed requests
- **(b)** 更高并发/请求量的第二次测试截图，与基线比较并解释差异
- **(c)** CloudWatch Metrics 截图，显示负载测试期间的 CPU 利用率飙升及后续触发的事件
- **(d)** 简要书面分析（3-5 句）：说明负载均衡器如何分配流量、系统如何响应增加的负载、展示应用在云环境中的可靠性和成本效益

### HD 标准

- 所有活动均有完整证据：健康状态、ALB 活跃、流量分发确认截图
- 两次不同参数的负载测试并进行比较
- CloudWatch 指标
- 清晰的书面分析解释负载分配

---

## 7. Team Collaboration（5 分）

### 交付物

1. **7.1 Team Collaboration Statement** — 团队协作声明
2. **7.2 Team Collaboration Evidence** — 协作证据：
   - Commit history（GitHub 的 graph view）
   - Feature branches
   - Pull requests（含 review）
   - Merge conflicts（及解决过程）
   - 团队会议时间和日期
   - 团队沟通渠道截图
3. **Team Agreement Sheet** — 全体成员签署，包含：
   - 每人的角色/任务
   - 贡献百分比（总计 100%）
   - 签名

### HD 标准

- 团队协议表全员签署，贡献说明合理
- GitHub 证据：一致的分支策略、每位成员有意义的提交历史、带 review 的 PR、已解决的合并冲突、并行开发的清晰图表
- 包含团队会议记录（日期）和沟通渠道截图
- 协作声明连贯且具体

---

## 8. Report（5 分）

### 交付物

1. **封面页** — 项目标题、成员姓名、学号、导师姓名、Tutorial 时间
2. **Gen-AI 使用报告** — 说明在项目中如何及在哪里使用了 Gen-AI 工具
3. **8. Discussion and Conclusion** — 开发过程讨论与项目总结
4. **9. Reflection** — 学到了什么、过程中遇到了哪些困难
5. **References** — 使用 APA 引用格式
6. 整体报告排版精美、全面、设计和协作解释清晰

### HD 标准

- 排版精美、全面的报告，对设计和协作有清晰的解释

---

## 附加注意事项

- GitHub Link 和 EC2 Instance ID/Name 必须在文档中提供，且链接确保可用
- 最终评分取决于 Week 13 的演示，用于验证功能完整性和对系统的理解
- 演示中需清晰展示项目如何运作，解释关键功能和设计决策
