from pydantic import BaseModel

class CommentSchema(BaseModel):
    username: str
    text: str
    post_id: int