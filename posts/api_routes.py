from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from db.database import get_db
from posts.schemas import PostSchema, PostDisplay
from posts.service import PostService
from typing import List
from oauth.oauth2 import get_current_user

router = APIRouter(
    prefix='/post',
    tags=['post']
)

@router.get('/all', response_model=List[PostDisplay])
def get_whole_posts(db:Session = Depends(get_db)):
    return PostService.get_whole_posts(db)

@router.post('', response_model=PostDisplay)
def create_new_post(data: PostSchema, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return PostService.create_new_post(db, data)

@router.post('/image')
def uploadfile(file: UploadFile = File(...), current_user= Depends(get_current_user)):
    return PostService.uploadfile(file)

@router.delete('/delete/{id}')
def delete_post_by_id(id: int, db:Session = Depends(get_db), current_user = Depends(get_current_user)):
    return PostService.delete_post_by_id(db, id, current_user)