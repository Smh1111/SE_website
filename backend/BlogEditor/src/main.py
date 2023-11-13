from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ZODB import FileStorage, DB
import transaction

from fastapi.middleware.cors import CORSMiddleware

# Data structures for blogs
class Blog(BaseModel):
    id: str
    title: str
    blocks: str
    publishedAt: str


app = FastAPI()

# Allow all origins in development, adjust this in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
#_______________________ZODB database____________________

# ZODB database setup
storage = FileStorage.FileStorage('mydatabase.fs')
db = DB(storage)
connection = db.open()
root = connection.root()

# Counter for generating IDs
blog_id_counter = 1

#_______________________Utility Functions____________________

# Function to delete a blog by ID
def delete_blog(blog_id: str):
    if blog_id in root:
        del root[blog_id]
        transaction.commit()
        return {"Success": f"Blog with ID {blog_id} deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail=f"Blog with ID {blog_id} not found")

# Function to update a blog by ID
def update_blog(blog_id: str, updated_blog: Blog):
    if blog_id in root:
        root[blog_id]["title"] = updated_blog.title
        root[blog_id]["blocks"] = updated_blog.blocks
        root[blog_id]["publishedAt"] = updated_blog.publishedAt
        transaction.commit()
        return {"Success": f"Blog with ID {blog_id} updated successfully"}
    else:
        raise HTTPException(status_code=404, detail=f"Blog with ID {blog_id} not found")

# ----------------------Route services-------------------------------

# -----GET services----

# GET all json-formatted blogs 
@app.get("/blogs/all")
async def get_all_blogs():
    # Retrieve all blogs from the database
    return list(root.values())

# GET a json-formatted blog by ID
@app.get("/blogs/{id}")
async def get_blog(id: str):
    # Retrieve a blog by ID from the database
    blog = root.get(id)
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


# -----POST services----

# Create a new blog from the json blog data in the {request body} sent from frontend
@app.post("/blog")
async def create_new_blog(request: Request, user_blog: Blog):
    global blog_id_counter

    print("Blog: ", user_blog)

    # Create a new blog with an incrementing ID
    new_blog = {
        "id": str(blog_id_counter),
        "title": user_blog.title,
        "blocks": user_blog.blocks,
        "publishedAt": user_blog.publishedAt
    }

    # Add the blog to the database
    root[blog_id_counter] = new_blog
    transaction.commit()

    # Increment the ID counter for the next blog
    blog_id_counter += 1

    
    return new_blog

@app.put("/blogs/{id}")
async def update_blog_endpoint(id: str, updated_blog: Blog):
    return update_blog(id, updated_blog)

@app.delete("/blogs/{id}")
async def delete_blog_endpoint(id: str):
    return delete_blog(id)

# Close the connection when the application shuts down
@app.on_event("shutdown")
def shutdown_event():
    connection.close()


