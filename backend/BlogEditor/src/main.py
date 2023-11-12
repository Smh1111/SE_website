from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

class Blog(BaseModel):
    ID: int
    title: str
    Blocks: str
    createdAt: str

app = FastAPI()

# Allow all origins in development, adjust this in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#_______________________ZODB database____________________
















#_______________________Route services____________________
@app.get("/blogs/all")
async def getAllBlogs():
    return {"message": "Hello world"}


@app.get("/blogs/{id}")
async def getBlog(id: int):
    return id

@app.post("/blog")
async def create_NewBlog(userBlog: Blog):
    id = userBlog.ID
    title = userBlog.title
    Blocks = userBlog.Blocks


    return userBlog

@app.put("/blogs/{id}")
async def update_Blog(id: int):
    return 

@app.delete("blogs/{id}")
async def delete_Blog(id: int):
    return 
