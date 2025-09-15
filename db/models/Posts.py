from db.base import Base
from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String, DateTime

class DbPosts(Base):
    __tablename__ = "post"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    image_url_type = Column(String)
    content = Column(String)
    timestamp = Column(DateTime)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('DbUser', back_populates='posts')
    
    comment = relationship('DbComment', back_populates='post')

