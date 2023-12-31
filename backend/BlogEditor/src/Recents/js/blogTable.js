const tableElement = document.getElementById("table");

function populateData(blogID, blogTitle, blogDate) {
	var table = document.getElementById("table");
	var rowCount = table.rows.length;

	var row = table.insertRow(rowCount);

	var cell1 = document.createElement("td");
	var cell2 = document.createElement("td");
	var cell3 = document.createElement("td");
	var cell4 = document.createElement("td");

	cell1.innerHTML = rowCount + ".";
	cell2.innerHTML = blogTitle; // "New Blog Title"
	cell3.innerHTML = blogDate; // "2023 Nov 12."
	cell4.innerHTML = "<button class='edit-button' edit-blog-id="
		+ blogID
		+">Edit</button> <button button class='delete-button' delete-blog-id="
		+ blogID
		+ "> Delete</button > ";

	row.appendChild(cell1);
	row.appendChild(cell2);
	row.appendChild(cell3);
	row.appendChild(cell4);
}
document.addEventListener("DOMContentLoaded", function (e) {
	const table = document.getElementById("table");
  
	// Add a click event listener to the table
	table.addEventListener("click", function (event) {
		// Check if the clicked element is an "Edit" button
		if (event.target.classList.contains("edit-button")) {
			// Get the blog ID from the data attribute
			const editBlogId = event.target.getAttribute("edit-blog-id");
			// Store the blogId in sessionStorage
			sessionStorage.setItem("editBlogId", editBlogId);
			// Navigate to the updateBlog page with the blog ID
			window.location.href = `updateBlog.html`;
		}

		if (event.target.classList.contains("delete-button")) {
			// Get the blog ID from the data attribute
			const deleteBlogId = event.target.getAttribute("delete-blog-id");
			// Store the blogId in sessionStorage
			sessionStorage.setItem("deleteBlogId", deleteBlogId);
			// Navigate to the updateBlog page with the blog ID
			window.location.href = `blogTable.html`;

			deleteBlogByID(deleteBlogId);
		}
	});
	e.preventDefault();
  });
  
/*---------------------------Using the GET api----------------------------- */
const apiUrl = "http://127.0.0.1:8000/blogs/all"; 

/*
fetch('https://example.com/', {
  method: 'GET',
  body: new FormData(),
});
*/
function getAllBlogs() {
	/*
	class Blog(BaseModel):
		ID: int
		title: str
		Blocks: str
		publishedAt: str

	*/
	/*
	const newBlog = {
		title: blogTitle,
		Blocks: blogBlocks,
		publishedAt: blogPublishedAt,
	};
      */ 
	fetch(apiUrl)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			// Assuming data is an array of objects with properties blogTitle and blogDate
			data.forEach((item) => {
				console.log("ID :" + item.id + "\ntitle : " + item.title + "\nblocks : " + item.blocks + "\npublished At : " + item.publishedAt);
				populateData(item.id, item.title, item.publishedAt);
			});

			// Process the data received from the API
		})
		.catch((error) => {
			console.error("Fetch error:", error);
		});
}
function deleteBlogByID(id)
{
	const deleteURL = "http://127.0.0.1:8000/blogs/" + id;
	const options = {
		method: 'Delete',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		mode: 'cors',

	};

	fetch(deleteURL, options);
}
getAllBlogs();
