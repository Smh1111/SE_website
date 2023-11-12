const editor = new EditorJS({
	holder: "editorjs",
	tools: {
		header: {
			class: Header,
			inlineToolbar: ["link", "italic"],
		},
		list: {
			class: List,
			inlineToolbar: ["link", "bold"],
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

		raw: RawTool,
		image: {
			class: ImageTool,
			config: {
				endpoints: {
					byFile: "http://localhost/phppot/javascript/create-web-text-editor-javascript/ajax-endpoint/upload.php", // Your backend file uploader endpoint
					byUrl: "http://localhost/phppot/javascript/create-web-text-editor-javascript/ajax-endpoint/upload.php", // Your endpoint that provides uploading by Url
				},
			},
		},
		checklist: {
			class: Checklist,
		},
		linkTool: {
			class: LinkTool,
			config: {
				endpoint:
					"http://localhost/phppot/jquery/editorjs/extract-link-data.php", // Your backend endpoint for url data fetching,
			},
		},
	},
});

var title = document.getElementById("title");




const publishButton = document.getElementById("publishBtn");

publishButton.addEventListener("click", async () => {
	try {
		// Save data from the first EditorJS instance
		const savedData = await editor.save();
		const jsonBlocksData = JSON.stringify(savedData.blocks, null, 2);
		console.log("Blocks data from editor:", jsonBlocksData);

		console.log("Title: ", title);
	} catch (error) {
		console.error("Error:", error);
	}
});

const apiUrl = "http://127.0.0.1:8000/blogs/1"; // Adjust the port as needed

fetch(apiUrl)
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json();
	})
	.then((data) => {
		console.log(data);
		return;
		// Process the data received from the API
	})
	.catch((error) => {
		console.error("Fetch error:", error);
	});
