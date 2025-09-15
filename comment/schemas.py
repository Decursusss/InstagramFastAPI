from pydantic import BaseModel
from datetime import datetime

class CommentSchema(BaseModel):
    username: str
    text: str
    post_id: int