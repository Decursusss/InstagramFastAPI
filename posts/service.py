from sqlalchemy.orm import Session
from sqlalchemy import select
from posts.schemas import PostSchema
from db.models import DbPosts
from datetime import datetime
from fastapi import HTTPException
import shutil
import string
import random

image_url_types = ['absolute', 'relative']

class PostService:
    @staticmethod
    def create_new_post(db: Session, data: PostSchema):
        if not data.image_url_type in image_url_types:
            raise HTTPException(status_code=404, detail="Parametr image_url_type can be only absolute or relative")
        
        new_post = DbPosts(
            image_url=data.image_url,
            image_url_type=data.image_url_type,
            content=data.content,
            timestamp=datetime.now(),
            user_id=data.user_id
        )
        
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        return new_post
    
    @staticmethod
    def delete_post_by_id(db: Session, id: int, current_user):
        result = db.execute(select(DbPosts).where(DbPosts.id == id))
        result = result.scalar_one_or_none()
        if not result:
            raise HTTPException(status_code=404, detail=f"Cannot delete post with id {id} not found")
        
        if result.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="U cannot delete not your own posts")
        
        db.delete(result)
        db.commit()
        return {
            'message': 'success',
            'deatail': f'Post with id {id} succesfully deleted'
        }
        
    @staticmethod
    def uploadfile(file):
        letters = string.ascii_letters
        rand_str = ''.join(random.choice(letters) for i in range(7))
        new = f"_{rand_str}."
        filename = new.join(file.filename.rsplit('.', 1))
        filePath = f'static/files/{filename}'
        with open(filePath, 'w+b') as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {
            'filename': filePath
        }
        
    @staticmethod
    def get_whole_posts(db: Session):
        result = db.execute(select(DbPosts))
        result = result.scalars().all()
        if not result:
            raise HTTPException(status_code=404, detail='Posts not found')
        
        return result