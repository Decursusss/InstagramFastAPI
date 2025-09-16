from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class User(BaseModel):
    username: str
    class Config:
        from_attributes = True

class Comment(BaseModel):
    username: str
    text: str
    timestamp: datetime
    class Config:
        from_attributes = True

class PostSchema(BaseModel):
    image_url: str
    image_url_type: str
    content: str
    user_id: int
    
    
class PostDisplay(BaseModel):
    id: int
    image_url: str
    image_url_type: str
    content: str
    timestamp: datetime
    user: User
    comments: List[Comment]
    class Config:
        from_attributes = True
        
        
        