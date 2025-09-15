from fastapi import APIRouter, Depends
from db.database import get_db
from sqlalchemy.orm import Session
from comment.schemas import CommentSchema

router = APIRouter(
    prefix='/comment',
    tags=['comment']
)

@router.get('/all/{post_id}')
def get_whole_comments_by_post_id(post_id: int, db:Session = Depends(get_db)):
    pass

@router.post('')
def create_comment_on_post(data: CommentSchema, db:Session = Depends(get_db)):
    pass