from fastapi import FastAPI
from db.database import init_db
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from users.api_routes import router as userRouter
from posts.api_routes import router as postRouter
from comment.api_routes import router as commentRouter

app = FastAPI()

app.include_router(userRouter)
app.include_router(postRouter)
app.include_router(commentRouter)

init_db()

app.mount('/static/files', StaticFiles(directory='static/files'), '/static/files')

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']  
)