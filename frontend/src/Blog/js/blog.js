
/*----------------------------fetching Data and  populating Data----------------------------*/

document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://127.0.0.1:8000/blogs/all";
  getAllBlogs();

  function getAllBlogs() {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((blogList) => {
        const sortedBlogList = blogList.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Get the article container element
        const blogContainer = document.getElementById("blogContainer");

        // Display only the four most recent blog articles
        const recentBlogs = sortedBlogList.slice(0, 4);

        // Iterate over the articles and append them to the container
        recentBlogs.forEach((blog) => {
            const blogHTML = createArticleHTML(blog);
            blogContainer.innerHTML += blogHTML;
        });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  // Function to generate HTML for an article
  function createArticleHTML(blog) {
    const imageURL = "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-1.png";
    const eachBlogLink = "../Blog/eachBlog.html";

    // Create a unique identifier for each blog link
    const linkId = `blogLink_${blog.id}`;

    // Return a template string with HTML structure
    return `
      <article class="max-w-xs">
        <a href="${eachBlogLink}" id="${linkId}" onclick="storeBlogId(${blog.id})">
          <img src="${imageURL}" class="mb-5 rounded-lg" alt="Image">
        </a>
        <h2 class="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
          <a href="${eachBlogLink}" onclick="storeBlogId(${blog.id})">${blog.title}</a>
        </h2>
        <p class="mb-4 text-gray-500 dark:text-gray-400">${blog.publishedAt}</p>
        <a href="${eachBlogLink}" onclick="storeBlogId(${blog.id})" class="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline">
          Read
        </a>
      </article>
    `;
  }

  
});
// Function to store the blog ID in session storage
function storeBlogId(blogId) {
  sessionStorage.setItem('blogId', blogId);
}