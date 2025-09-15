from db.models import DbUser
from sqlalchemy.orm import Session
from sqlalchemy import select
from users.schemas import UserSchema
from fastapi import HTTPException
from users.hash import Hash

class UserService:
    @staticmethod
    def create_new_user(db:Session, data: UserSchema):
        result = db.execute(select(DbUser).where(DbUser.username == data.username))
        result = result.scalar_one_or_none()
        if result:
            raise HTTPException(status_code=404, detail=f"User already exist with username {data.username}")
        
        new_user = DbUser(
            username=data.username,
            email=data.email,
            password=Hash.bcrypt(data.password)
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    
    @staticmethod
    def get_whole_users(db:Session):
        result = db.execute(select(DbUser))
        result = result.scalars().all()
        if not result:
            raise HTTPException(status_code=404, detail="Users not found")
        
        return result
    
    @staticmethod
    def login_user(db:Session, request):
        result = db.execute(select(DbUser).where(DbUser.username == request.username))
        result = result.scalar_one_or_none()
        if not result:
            raise HTTPException(status_code=404, detail=f"User {request.username} not found ")
        
        if not Hash.verify(result.password, request.password):
            raise HTTPException(status_code=404, detail="Password is not correct")
        
        from oauth.oauth2 import create_access_token
        access_token = create_access_token(data={'username': result.username})
        
        return {
            'access_token': access_token,
            'toke_type': 'bearer',
            'user_id': result.id,
            'username': result.username
        }
        
    @staticmethod
    def get_user_by_id(db:Session, id:int):
        result = db.execute(select(DbUser).where(DbUser.id == id))
        result = result.scalar_one_or_none()
        if not result:
            raise HTTPException(status_code=404, detail=f"User with id {id} not found")
        
        return result
        
    @staticmethod
    def get_user_by_username(db: Session, username: str):
        result = db.execute(select(DbUser).where(DbUser.username == username))
        result = result.scalar_one_or_none()
        if not result:
            raise HTTPException(status_code=404, detail=f"User {username} not found")
        
        return result