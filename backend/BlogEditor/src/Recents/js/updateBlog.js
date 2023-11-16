// header,list,checklist,
// quote, delimiter, image
// embed,, table, linktool
// marker, inlinecode, code
// paragraph, raw

const editor = new EditorJS({
	holder: "edit-data",
	readOnly: false,
	inlineToolbar: true,
	tools: {
		header: {
			class: Header,
			inlineToolbar: ["marker", "link"],
			config: {
				placeholder: "Header",
			},
			shortcut: "CMD+SHIFT+H",
		},
		list: {
			class: List,
			inlineToolbar: true,
			shortcut: "CMD+SHIFT+L",
		},
		checklist: {
			class: Checklist,
		},
		quote: {
			class: Quote,
			inlineToolbar: true,
			config: {
				quotePlaceholder: "Enter a quote",
				captionPlaceholder: "Quote's author",
			},
			shortcut: "CMD+SHIFT+O",
		},
		delimiter: {
			class: Delimiter,
		},
		image: {
			class: ImageTool,
		},
		embed: {
			class: Embed,
			inlineToolbar: false,
			config: {
				services: {
					youtube: true,
				},
			},
		},
		table: {
			class: Table,
			inlineToolbar: true,
			shortcut: "CMD+ALT+T",
		},
		linkTool: {
			class: LinkTool,
		},
		marker: {
			class: Marker,
		},

		code: {
			class: CodeTool,
		},
		paragraph: {
			class: Paragraph,
		},
		raw: RawTool,
	},
});


let blogId;

document.addEventListener("DOMContentLoaded", async () => {
	// Retrieve the blogId from sessionStorage
	blogId = sessionStorage.getItem("editBlogId");
  
	// Now you have the blogId, and you can use it as needed
  
	console.log('Blog ID:', blogId, typeof (blogId));
	
	getBlog_populateData(blogId);

});
function getBlog_populateData(id) {
	const apiUrl = "http://127.0.0.1:8000/blogs/" + id; // Adjust the port as needed
	console.log(apiUrl);
	fetch(apiUrl)
	    .then((response) => {
		  if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		  }
		  return response.json();
	    })
	    .then((data) => {
		  // data.id, data.title, data.blocks, data.publishedAt
  
		  // Process the data received from the API
		  console.log("data ", data);
		  console.log("data.title ", data.title);
		  console.log("data.blocks ", data.blocks);
		  const titleInput = document.getElementById("title");
		  titleInput.value = data.title;
  
		  
  
	    })
	    .catch((error) => {
		  console.error("Fetch error:", error);
	    });
  }
  
// Function to get the current date and time
function getCurrentDateTime() {
	var currentDate = new Date();
	return currentDate.toLocaleString(); // Adjust the format as needed
}

const updateButton = document.getElementById("updateBtn");
const confirmationModal = document.getElementById("confirmationModal");
const confirmYesButton = document.getElementById("confirmYes");
const confirmNoButton = document.getElementById("confirmNo");
const mainContainer = document.getElementById("main");

  
updateButton.addEventListener("click", (event) => {
	// Prevent the default form submission behavior
	event.preventDefault();

	// Show the custom confirmation modal
	confirmationModal.style.display = "block";
});

confirmYesButton.addEventListener("click", async () => {
	// Get the title value
	const title = document.getElementById("title").value;

	// Get the selected file
	const imageFileInput = document.getElementById("image");
	const imageFile = imageFileInput.files[0];
  
	// Save data from the EditorJS instance
	const savedData = await editor.save();
	const jsonBlocksData = JSON.stringify(savedData.blocks, null, 2);

	// Get the current date and time
	var creationTime = getCurrentDateTime();
	console.log("id: ", blogId, typeof(blogId));
	console.log("Title: ", title, typeof(title));
	console.log("savedData: ", savedData);
	console.log("Blocks data from editor:", jsonBlocksData, typeof(jsonBlocksData));
	console.log("Blog created on:", creationTime, typeof(creationTime));

	updateBlog(blogId, title, savedData, creationTime);
	update_UploadImage(imageFile, blogId);
	// Hide the modal after confirming
	confirmationModal.style.display = "none";
});

confirmNoButton.addEventListener("click", () => {
	// Hide the modal after canceling
	confirmationModal.style.display = "none";
});



/*---------------------------Using the post api----------------------------- */

/*
fetch('https://example.com/', {
  method: 'GET',
  body: new FormData(),
});
*/
function updateBlog(blogId, blogTitle, blogBlocks, blogPublishedAt) {

	let newBlog = {
		id: blogId,
		title: blogTitle,
		blocks: blogBlocks,
		publishedAt: blogPublishedAt,
		HTML: ""
	};
		const options = {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		mode: 'cors',
	
		body: JSON.stringify(newBlog),
	};

	fetch("http://127.0.0.1:8000/blogs/update", options)
	.then((response) => response.json())
	.then((data) => {
	    console.log("Blog uploaded successfully:", data);
	    return data; // Return the image link
	})
	.catch((error) => {
	    console.error("Error updating blog:", error);
	    throw error;
	});
		
}


async function update_UploadImage(imageFile, id) {
	const formData = new FormData();
	formData.append("image", imageFile);

  
	return fetch(`http://127.0.0.1:8000/blogs/update-upload-image/${id}`, {
	    method: "POST",
	    body: formData,
	})
	.then((response) => response.json())
	.then((data) => {
	    console.log("Image uploaded successfully:", data);
	    return data; // Return the image link
	})
	.catch((error) => {
	    console.error("Error uploading image:", error);
	    throw error;
	});
  }
  