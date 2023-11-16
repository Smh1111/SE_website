document.addEventListener("DOMContentLoaded", async () => {
	// Retrieve the blogId from sessionStorage
	const blogId = sessionStorage.getItem("blogId");
    
	await getBlogById_Request(blogId);
    });
    
    async function getBlogById_Request(id) {
	try {
	  const apiUrl = "http://127.0.0.1:8000/blogs/" + id;
	  const response = await fetch(apiUrl);
    
	  if (!response.ok) {
	    throw new Error(`HTTP error! Status: ${response.status}`);
	  }
    
	  const blog = await response.json();
	  await populateArticle(blog);
	} catch (error) {
	  console.error("Fetch error:", error);
	}
    }
    
    async function populateArticle(blog) {
	try {
	  const articleContainer = document.getElementById("eachBlog");
	  const imageURL = await getImageUrl(blog.id);
    
		/*
	  var html = '';
		blog.blocks.blocks.forEach(function (block) {
			switch (block.type) {
				case 'header':
					html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
					break;
				case 'paragraph':
					html += `<p>${block.data.text}</p>`;
					break;
				case 'delimiter':
					html += '<hr />';
					break;
				case 'image':
					html += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
					break;
				case 'list':
					html += '<ul>';
					block.data.items.forEach(function (li) {
						html += `<li>${li}</li>`;
					});
					html += '</ul>';
					break;
				default:
					console.log('Unknown block type', block.type);
					console.log(block);
					break;
			}
		})
		const edjsParser = edjsHTML();
	  const blog_HTML_contents_Array = edjsParser.parse(blog.blocks);
		const html = blog_HTML_contents_Array.join(" ");
		console.log(html)
		console.log(typeof(html))
	 
	 */
		
		 var parser = new edjsParser(undefined, undefined, undefined);
		const html = parser.parse(blog.blocks);
		console.log(html);

	  
		
	  articleContainer.innerHTML = `
	    <header class="mb-4 lg:mb-6 not-format">
		<h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
		  ${blog.title}
		</h1>
		<span class="text-gray-600 dark:text-gray-400 text-sm spanTag">${blog.publishedAt}</span>
	    </header>
    
	    <figure>
		<img src="${imageURL}" alt="">
	    </figure>`
		
	    articleContainer.innerHTML +=html
	    

	  
	} catch (error) {
	  console.error("Error populating article:", error);
	}
    }
    
    async function getImageUrl(blogId) {
	try {
	  const imageUrlApi = `http://127.0.0.1:8000/image/${blogId}`;
	  const options = {
	    
	  };
    
	  const response = await fetch(imageUrlApi, options);
    
	  if (!response.ok) {
	    throw new Error(`HTTP error! Status: ${response.status}`);
	  }
    
	  return response.url; // Extract the image URL from the response
	} catch (error) {
	  console.error("Error fetching image URL:", error);
	  return ''; // Handle error by returning a default or empty URL
	}
    }
    
