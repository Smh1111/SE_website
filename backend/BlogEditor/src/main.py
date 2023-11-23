

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ZODB import FileStorage, DB
from fastapi import File, UploadFile
from pathlib import Path
from typing import Optional
from fastapi.templating import Jinja2Templates

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import transaction

from pyeditorjs import EditorJsParser


# ----------------------------Data structures for blogs----------------------------
class Blog(BaseModel):
    id: str
    title: str
    blocks: object
    publishedAt: str
    
    HTML: str

app = FastAPI()

template = Jinja2Templates(directory="templates")

# ----------------------------Allow all origins in development, adjust this in production----------------------------
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

# ----------------------------Counter for generating Fake IDs----------------------------
blog_id_counter = 1


# ----------------------------Serve the "uploads" directory as static files----------------------------
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/image/{blog_id}")
def get_image(blog_id: int):
    # Assuming the images are named like "{blog_id}.png" or "{blog_id}.jpeg" in the "uploads" directory
    image_path_png = os.path.join("uploads", f"{blog_id}.png")
    image_path_jpeg = os.path.join("uploads", f"{blog_id}.jpeg")
    image_path_jpg = os.path.join("uploads", f"{blog_id}.jpg")

    # Check if the image file exists, prioritize PNG over JPEG
    if os.path.isfile(image_path_png):
        return FileResponse(image_path_png, media_type="image/png")
    elif os.path.isfile(image_path_jpeg):
        return FileResponse(image_path_jpeg, media_type="image/jpeg")
    elif os.path.isfile(image_path_jpg):
        return FileResponse(image_path_jpg, media_type="image/jpg")
    else:
        raise HTTPException(status_code=404, detail="Image not found")

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpeg', 'jpg'}

def get_image_path(id: str, extension: str) -> Path:
    return UPLOAD_FOLDER / f"{id}.{extension.lower()}"


# Utility Function to print all blogs
def is_blog_id_exists(blog_id: str) -> bool:
    for blog in list(root.values()):
        if blog['id'] == blog_id:
            return True
    return False

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


# ----------------------------Function to update a blog by ID----------------------------
def update_blog(updated_blog: Blog):

    if is_blog_id_exists(updated_blog.id):
        blog_id = int(updated_blog.id)
        root[blog_id]["title"] = updated_blog.title
        root[blog_id]["blocks"] = updated_blog.blocks
        root[blog_id]["publishedAt"] = updated_blog.publishedAt
        root[blog_id]["HTML"] = updated_blog.HTML

        transaction.commit()
        return {"Success": f"Blog with ID {blog_id} updated successfully"}
    else:
        raise HTTPException(status_code=404, detail=f"Blog with ID {blog_id} not found")

# print("hello")
# print(list(root.values()))

# ----------------------------GET services----------------------------

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
            #editor_js_data = ... # your Editor.js JSON data
            parser = EditorJsParser(blog["blocks"]) # initialize the parser

            html = parser.html(sanitize=True) # `sanitize=True` requires `bleach` to be installed
            # print(html) # your clean HTML
            # print(type(html))
            
            return blog
    else:
        raise HTTPException(status_code=404, detail=f"Blog with ID {blog_id} not found")




# ----------------------------POST services----------------------------

# Create a new blog from the json blog data in the {request body} sent from frontend

@app.post("/blog")
async def create_new_blog(request: Request, user_blog: Blog):
    global blog_id_counter

    # print("Blog: ", user_blog)


    parser = EditorJsParser(user_blog.blocks) # initialize the parser

    html = parser.html(sanitize=True) # `sanitize=True` requires `bleach` to be installed
    # print(html) # your clean HTML
    # print(type(html))
    # Create a new blog with an incrementing ID
    new_blog = {
        "id": str(blog_id_counter),
        "title": user_blog.title,
        "blocks": user_blog.blocks,
        "publishedAt": user_blog.publishedAt,
        "HTML": html
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

    id = str(blog_id_counter-1)
  

    print(image.filename)
    filename = f"{id}.{image.filename.split('.')[-1].lower()}"

    file_path = UPLOAD_FOLDER / filename
    with file_path.open("wb") as f:
        f.write(image.file.read())

    image_link = f"/uploads/{blog_id_counter}_{image.filename}"  # Construct the link
    return {"filename": image.filename, "image_link": image_link}


@app.post("/blogs/update-upload-image/{id}")
async def update_image_endpoint(id: str, image: UploadFile = File(...)):
    try:
        # Check if an image with the given ID already exists
        existing_image_path = UPLOAD_FOLDER / f"{id}.{image.filename.split('.')[-1].lower()}"
        if existing_image_path.is_file():
            # Remove the existing image
            existing_image_path.unlink()

        # Save the new image with the provided ID
        filename = f"{id}.{image.filename.split('.')[-1].lower()}"
        file_path = UPLOAD_FOLDER / filename
        with file_path.open("wb") as f:
            f.write(image.file.read())

        image_link = f"/uploads/{id}_{image.filename}"  # Construct the link
        return {"filename": image.filename, "image_link": image_link}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating image: {e}")
    

# ----------------------------PUT services----------------------------
@app.put("/blogs/update")
async def update_blog_endpoint(request: Request, updated_blog: Blog):
    return update_blog(updated_blog)


# ----------------------------DELETE services----------------------------

@app.delete("/blogs/{id}")
async def delete_blog_endpoint(id: str):
    try:
        # Try to delete the blog
        result = delete_blog(id)

        # Remove associated images with allowed extensions
        for extension in ALLOWED_IMAGE_EXTENSIONS:
            image_path = get_image_path(id, extension)
            if image_path.is_file():
                image_path.unlink()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting blog: {e}")

# ----------------------------Close the connection when the application shuts down----------------------------
@app.on_event("shutdown")
def shutdown_event():
    connection.close()

# ----------------------------template if the custom structure for the blog is needed----------------------------
@app.get("/{blog_id}", response_class=HTMLResponse)
async def index(request: Request, blog_id:str):
    for blog in list(root.values()):
        if blog['id'] == blog_id:
            
            parser = EditorJsParser(blog["blocks"]) # initialize the parser

            html = parser.html(sanitize=True) 
            # print(html) # clean HTML
            # print(type(html))
            
            return template.TemplateResponse("blog.html", {"request": request, "html":blog["HTML"]})
    else:
        raise HTTPException(status_code=404, detail=f"Blog with ID {blog_id} not found")