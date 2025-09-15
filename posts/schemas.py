from pydantic import BaseModel
from datetime import datetime

class User(BaseModel):
    username: str
    class Config:
        from_attributes = True

class PostSchema(BaseModel):
    image_url: str
    image_url_type: str
    content: str
    user_id: str
    
    
class PostDisplay(BaseModel):
    id: int
    image_url: str
    image_url_type: str
    content: str
    timestamp: datetime
    user: User
    class Config:
        from_attributes = True