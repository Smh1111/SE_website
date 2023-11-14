// sessionStorage.setItem("BlogId", 1);

document.addEventListener("DOMContentLoaded", async () => {
	// Retrieve the blogId from sessionStorage
	blogId = sessionStorage.getItem("blogId");

	getBlogById_Request(blogId);
});

function getBlogById_Request(id) {
	const apiUrl = "http://127.0.0.1:8000/blogs/" + id;
	fetch(apiUrl)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		})
		.then((blog) => {
			populateArticle(blog);
		})
		.catch((error) => {
			console.error("Fetch error:", error);
		});

	// Function to populate the article with blog data
	function populateArticle(blog) {
		// blog.id, blog.title, blog.blocks, blog.publishedAt
		const articleContainer = document.getElementById("eachBlog");

		const edjsParser = edjsHTML();
		const blog_HTML_contents_Array = edjsParser.parse(blog.blocks);

		var combinedString = blog_HTML_contents_Array.join(" ");

		articleContainer.innerHTML = `
      <header class="mb-4 lg:mb-6 not-format">
        <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
          ${blog.title}
        </h1>
	  <p class="text-gray-600 dark:text-gray-400 text-sm">${blog.publishedAt}</p>

      </header>
      
     	${combinedString}
    `;

	}
}
