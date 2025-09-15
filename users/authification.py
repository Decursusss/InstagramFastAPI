from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from db.database import get_db
from sqlalchemy.orm import Session
from users.service import UserService

router = APIRouter(
    tags=['authification']
)

@router.post('/login')
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return UserService.login_user(db, request)