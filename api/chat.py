from fastapi import APIRouter
from starlette.responses import StreamingResponse

from app.agent.personal_chief import chat_dietitian, get_messages_history, clear_messages, list_threads
from schema.models import ChatRequest

router = APIRouter(prefix="/api")


@router.post("/chat/stream")
async def chat_endpoint(request: ChatRequest):
    """流式对话"""
    return StreamingResponse(
        chat_dietitian(request.message, request.image_url, request.thread_id),
        media_type="text/event-stream"
    )


@router.get("/chat/history/{thread_id}")
async def get_chat_history(thread_id: str):
    """获取历史消息"""
    messages = get_messages_history(thread_id)
    return {"messages": messages}


@router.get("/chat/threads")
async def get_threads():
    """获取所有会话列表"""
    threads = list_threads()
    return {"threads": threads}


@router.delete("/chat/history/{thread_id}")
async def clear_chat_history(thread_id: str):
    """清空历史消息"""
    clear_messages(thread_id)
    return {"success": True}
