

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ZODB import FileStorage, DB
from fastapi import File, UploadFile
from pathlib import Path
from typing import Optional
import transaction

# Data structures for blogs
class Blog(BaseModel):
    id: str
    title: str
    blocks: object
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

# ZODB database setup
storage = FileStorage.FileStorage('mydatabase.fs')
db = DB(storage)
connection = db.open()
root = connection.root()

# Counter for generating IDs
blog_id_counter = 1

# Utility Function to print all blogs
def is_blog_id_exists(blog_id: str) -> bool:
    for blog in list(root.values()):
        if blog['id'] == blog_id:
            return True
    return False

# Function to delete a blog by ID
# Function to delete a blog by ID
def delete_blog(blog_id: str):
    try:
        if is_blog_id_exists(blog_id):
            del root[int(blog_id)]
            transaction.commit()
            return {"Success": f"Blog with ID {blog_id} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"Blog with ID {blog_id} not found")
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Blog with ID {blog_id} not found")
    except Exception as e:
        print(f"Error deleting blog: {e}")
        raise


# Function to update a blog by ID
def update_blog(updated_blog: Blog):

    if is_blog_id_exists(updated_blog.id):
        blog_id = int(updated_blog.id)
        root[blog_id]["title"] = updated_blog.title
        root[blog_id]["blocks"] = updated_blog.blocks
        root[blog_id]["publishedAt"] = updated_blog.publishedAt

        transaction.commit()
        return {"Success": f"Blog with ID {blog_id} updated successfully"}
    else:
        raise HTTPException(status_code=404, detail=f"Blog with ID {blog_id} not found")

print("hello")
print(list(root.values()))

# -----GET services----

# GET all json-formatted blogs 
@app.get("/blogs/all")
async def get_all_blogs():
    # Retrieve all blogs from the database
    return list(root.values())

# GET a json-formatted blog by ID
@app.get("/blogs/{blog_id}")
async def get_blog(blog_id: str):
    # Retrieve a blog by ID from the database
    
    for blog in list(root.values()):
        if blog['id'] == blog_id:
            return blog
    else:
        raise HTTPException(status_code=404, detail=f"Blog with ID {blog_id} not found")


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
        "publishedAt": user_blog.publishedAt,
    }

    # Add the blog to the database
    root[blog_id_counter] = new_blog
    transaction.commit()

    # Increment the ID counter for the next blog
    blog_id_counter += 1

    return new_blog

UPLOAD_FOLDER = Path("uploads")
@app.post("/upload-image")
async def upload_image(image: UploadFile = File(...)):
    global blog_id_counter

    id = str(blog_id_counter)
  

    print(image.filename)
    filename = f"{blog_id_counter}.{image.filename.split('.')[-1].lower()}"

    file_path = UPLOAD_FOLDER / filename
    with file_path.open("wb") as f:
        f.write(image.file.read())
    image_link = f"/uploads/{blog_id_counter}_{image.filename}"  # Construct the link
    return {"filename": image.filename, "image_link": image_link}

@app.put("/blogs/update")
async def update_blog_endpoint(request: Request, updated_blog: Blog):
    return update_blog(updated_blog)


@app.delete("/blogs/{id}")
async def delete_blog_endpoint(id: str):
    return delete_blog(id)

# Close the connection when the application shuts down
@app.on_event("shutdown")
def shutdown_event():
    connection.close()
