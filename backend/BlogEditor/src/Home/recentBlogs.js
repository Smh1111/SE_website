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
              getImageUrl(blog.id)
                .then((imageURL) => {
                  const blogHTML = createArticleHTML(blog, imageURL);
                  blogContainer.innerHTML += blogHTML;
                })
                .catch((error) => {
                  console.error("Error fetching image URL:", error);
                });
            });
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
      }
    
      // Function to fetch image URL from the server
      async function getImageUrl(blogId) {
        const imageUrlApi = `http://127.0.0.1:8000/image/${blogId}`;
        const options = {
          
          mode: 'cors',
      
        };
        return fetch(imageUrlApi, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.url; // Extract the image URL from the response
          });
      }
    
      // Function to generate HTML for an article
      // Function to generate HTML for an article
    function createArticleHTML(blog, imageURL) {
      const eachBlogLink = `../Blog/eachBlog.html?id=${blog.id}`;
    
      return `
        <article class="max-w-xs article-container">
          <div class="grid-article-div">
            
              <img src="${imageURL}" class="blog-image mb-5 rounded-lg" alt="Image">
            
          </div>
          <div >
            <h2 class="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
              ${blog.title}
            </h2>
            <p class="mb-4 text-gray-500 dark:text-gray-400">${blog.publishedAt}</p>
            
    
          <div>
        </article>
      `;
    }
    
    });
    
    