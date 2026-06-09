import os
import uuid

import oss2
from dotenv import load_dotenv
from fastapi import APIRouter, UploadFile, File

load_dotenv()

router = APIRouter(prefix="/api")

# OSS 配置
access_key_id = os.getenv("OSS_ACCESS_KEY_ID")
access_key_secret = os.getenv("OSS_ACCESS_KEY_SECRET")
bucket_name = os.getenv("OSS_BUCKET")
endpoint = os.getenv("OSS_ENDPOINT", "oss-cn-beijing.aliyuncs.com")

auth = oss2.Auth(access_key_id, access_key_secret)
bucket = oss2.Bucket(auth, endpoint, bucket_name)


@router.post("/file/upload")
async def upload_file(file: UploadFile = File(...)):
    """接收前端文件，上传到 OSS，返回访问地址"""
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else "jpg"
    uid = str(uuid.uuid4())
    new_filename = f"{uid}.{ext}"

    content = await file.read()
    bucket.put_object(new_filename, content)

    access_url = f"https://{bucket_name}.{endpoint}/{new_filename}"

    return {
        "accessUrl": access_url,
        "filename": new_filename,
    }
