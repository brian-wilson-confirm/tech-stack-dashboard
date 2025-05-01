import asyncio
from fastapi import WebSocket


async def update_progress(websocket: WebSocket, progress: int, stage: str):
    await websocket.send_json({"progress": progress, "stage": stage})
    await asyncio.sleep(0)