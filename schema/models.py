from pydantic import BaseModel


class ChatRequest(BaseModel):
    """前端消息请求体"""
    # 消息内容
    message: str
    # 图片地址
    image_url: list[str]
    # 会话id
    thread_id: str
