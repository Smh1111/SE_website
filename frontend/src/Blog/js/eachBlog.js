/*---------------------------Using the GET api----------------------------- */
const apiUrl = "http://127.0.0.1:8000/blogs/2";

/*
fetch('https://example.com/', {
  method: 'GET',
  body: new FormData(),
});
*/
function getBlogByID() {
	/*
	class Blog(BaseModel):
		ID: int
		title: str
		Blocks: object
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
			console.log(data);

			const edjsParser = edjsHTML();
			const HTML = edjsParser.parse(data.blocks);
			// returns array of html strings per block
			console.log(HTML);
		})
		.catch((error) => {
			console.error("Fetch error:", error);
		});
}

getBlogByID();
