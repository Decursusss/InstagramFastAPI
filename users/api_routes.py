from fastapi import APIRouter, Depends
from db.database import get_db
from sqlalchemy.orm import Session
from users.schemas import UserSchema, UserDisplay
from users.service import UserService
from typing import List

router = APIRouter(
    prefix='/user',
    tags=['user']
)

@router.get('/', response_model=List[UserDisplay])
def get_whole_users(db: Session = Depends(get_db)):
    return UserService.get_whole_users(db)

@router.get('/{id}')
def get_user_by_id(id:int, db: Session = Depends(get_db)):
    return UserService.get_user_by_id(db, id)

@router.post('/register', response_model=UserDisplay)
def create_new_user(data:UserSchema, db: Session = Depends(get_db)):
    return UserService.create_new_user(db, data)

@router.post('/login')
def login(username: str, password: str, db: Session = Depends(get_db)):
    return UserService.login_user(db, username, password)
