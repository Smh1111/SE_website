// header,list,checklist,
// quote, delimiter, image
// embed,, table, linktool
// marker, inlinecode, code
// paragraph, raw

const editor = new EditorJS({
	holder: "editorjs",
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

// Function to get the current date and time
function getCurrentDateTime() {
	var currentDate = new Date();
	return currentDate.toLocaleString(); // Adjust the format as needed
}

const publishButton = document.getElementById("publishBtn");
const confirmationModal = document.getElementById("confirmationModal");
const confirmYesButton = document.getElementById("confirmYes");
const confirmNoButton = document.getElementById("confirmNo");
const mainContainer = document.getElementById("main");

publishButton.addEventListener("click", (event) => {
	// Prevent the default form submission behavior
	event.preventDefault();
  
	// Get the title value
	const title = document.getElementById("title").value;
  
	// Get the selected file
	const imageFileInput = document.getElementById("image");
	const imageFile = imageFileInput.files[0];
  
	// Get the error message element
	const errorMessage = document.getElementById("error-message");
  
	// Validate that both title and background image are provided
	if (title.trim() === "" || !imageFile) {
	    errorMessage.innerText = "Please provide both title and background image.";
	    errorMessage.style.color = "red";
	} else {
	    // Clear the error message if there are no issues
	    errorMessage.innerText = "";
  
	    // Show the custom confirmation modal
	    confirmationModal.style.display = "block";
	}
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
  
	console.log("Title: ", title, typeof title);
	console.log("savedData: ", savedData);
	console.log(
	    "Blocks data from editor:",
	    jsonBlocksData,
	    typeof jsonBlocksData
	);
	console.log("Blog created on:", creationTime, typeof creationTime);
  
	createNewBlog(title, savedData, creationTime);
	uploadImage(imageFile);
  
	// Hide the modal after confirming
	confirmationModal.style.display = "none";
  });
  

  
confirmNoButton.addEventListener("click", () => {
	// Hide the modal after canceling
	confirmationModal.style.display = "none";
});

/*---------------------------Using the post api----------------------------- */
const apiUrl = "http://127.0.0.1:8000/blog"; // Adjust the port as needed

/*
fetch('https://example.com/', {
  method: 'GET',
  body: new FormData(),
});
*/
function createNewBlog(blogTitle, blogBlocks, blogPublishedAt) {
	let newBlog = {
	    id: "0",
	    title: blogTitle,
	    blocks: blogBlocks,
	    publishedAt: blogPublishedAt,
	    HTML: ""
	};
  
	const options = {
		method: "POST",
		body: JSON.stringify(newBlog),
		headers: {
		  "Content-Type": "application/json",
		},
	    };
  
	fetch(apiUrl, options);
  }
 async function uploadImage(imageFile) {
	const formData = new FormData();
	formData.append("image", imageFile);
  
	return fetch(`http://127.0.0.1:8000/upload-image`, {
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
  

  