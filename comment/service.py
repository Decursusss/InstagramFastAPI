from sqlalchemy.orm import Session
from sqlalchemy import select
from comment.schemas import CommentSchema
from db.models import DbComment
from datetime import datetime
from fastapi import HTTPException

class CommentService:
    @staticmethod
    def create_comment(db:Session, data: CommentSchema):
        new_comment = DbComment(
            username = data.username,
            text = data.text,
            timestamp = datetime.now(),
            post_id = data.post_id
        )
        
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        return new_comment
        

    @staticmethod
    def get_all_comments(db:Session, post_id: int):
        result = db.execute(select(DbComment).where(DbComment.post_id == post_id))
        result = result.scalars().all()
        return result
        
        