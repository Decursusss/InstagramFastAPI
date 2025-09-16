from pydantic import BaseModel

class UserSchema(BaseModel):
    username: str
    email: str
    password: str
    
class UserDisplay(BaseModel):
    id: int
    username: str
    email: str
    class Config:
        from_attributes = True