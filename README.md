# TasteAI — AI 营养厨师

智能饮食推荐助手。上传食材照片或输入饮食目标，AI 为你推荐评分食谱，包含营养数据、食材清单和制作步骤。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 + TypeScript + Vite + Tailwind CSS 4 |
| 后端 | Python FastAPI + Uvicorn |
| AI | LangChain/LangGraph + 阿里百炼 Qwen-VL-Max |
| 搜索 | Tavily Search API |
| 存储 | Alibaba Cloud OSS（图片）/ MongoDB（会话记忆） |

## 项目结构

```
tasteai/
├── api/                    # FastAPI 路由
│   ├── chat.py             # 聊天流式接口、历史会话
│   └── file.py             # 图片上传到 OSS
├── app/                    # 核心逻辑
│   ├── main.py             # FastAPI 入口，CORS，路由注册
│   └── agent/
│       └── personal_chief.py  # LangGraph Agent，系统提示词，MongoDB 检查点
├── schema/
│   └── models.py           # Pydantic 数据模型
├── frontend/               # Vue 3 前端
│   └── src/
│       ├── api/client.ts        # API 调用封装
│       ├── composables/         # 业务逻辑 hooks
│       ├── components/          # UI 组件
│       └── styles/main.css      # Tailwind 主题
├── pyproject.toml
└── .env.example            # 环境变量模板（需自行创建）
```

## 快速开始

### 前置依赖

- Python 3.10+
- Node.js 18+
- MongoDB（本地或远程）
- 阿里云 OSS Bucket（用于图片存储）
- 阿里百炼 API Key（DashScope）
- Tavily API Key（网页搜索）

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/tasteai.git
cd tasteai
```

### 2. 环境变量

复制并填写 `.env` 文件：

```bash
cp .env.example .env
```

`.env` 内容：

```env
DASHSCOPE_API_KEY=sk-xxx
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
TAVILY_API_KEY=tvly-xxx
MONGODB_URI=mongodb://localhost:27017
OSS_ACCESS_KEY_ID=xxx
OSS_ACCESS_KEY_SECRET=xxx
OSS_BUCKET=your-bucket
OSS_ENDPOINT=oss-cn-beijing.aliyuncs.com
```

### 3. 启动后端

```bash
# 安装依赖
uv sync

# 启动 FastAPI（端口 8000）
uv run uvicorn app.main:app --reload --port 8000
```

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

访问 `http://localhost:3000`。

> 前端 Vite 开发服务器会自动将 `/api` 请求代理到后端 `localhost:8000`。

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/file/upload` | 上传图片到 OSS，返回访问 URL |
| POST | `/api/chat/stream` | 发送消息，SSE 流式返回 |
| GET | `/api/chat/history/{thread_id}` | 获取会话历史 |
| DELETE | `/api/chat/history/{thread_id}` | 清空会话 |
| GET | `/api/chat/threads` | 获取所有会话列表 |
| GET | `/health` | 健康检查 |

## 功能特性

- 食材图片识别与上传（阿里云 OSS）
- 多轮对话（MongoDB 持久化）
- SSE 流式响应
- 食谱评分与营养数据展示
- 深色/浅色模式
- 响应式布局（桌面/平板/手机）
- 营养档案自定义（热量/蛋白质/脂肪/碳水目标）
