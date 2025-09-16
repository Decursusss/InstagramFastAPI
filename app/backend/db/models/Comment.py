from db.base import Base
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String, DateTime

class DbComment(Base):
    __tablename__ = "comment"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    text = Column(String)
    timestamp = Column(DateTime)
    
    post_id = Column(Integer, ForeignKey('post.id'))
    post = relationship('DbPosts', back_populates='comments')