/*----------------------------AutoTyping Effect----------------------------*/ 
const dynamicText = document.querySelector("div span");
const words = ["<Code>", "<Build>", "<Future>", "<Test>", "<Deploy>", "<Debug>"];

// Variables to track the position and deletion status of the word
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
    const currentWord = words[wordIndex];
    const currentChar = currentWord.substring(0, charIndex);
    dynamicText.textContent = currentChar;
    dynamicText.classList.add("stop-blinking");

    if (!isDeleting && charIndex < currentWord.length) {
        // If condition is true, type the next character
        charIndex++;
        setTimeout(typeEffect, 50);
    } else if (isDeleting && charIndex > 0) {
        // If condition is true, remove the previous character
        charIndex--;
        setTimeout(typeEffect, 50);
    } else {
        // If word is deleted then switch to the next word
        isDeleting = !isDeleting;
        dynamicText.classList.remove("stop-blinking");
        wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
        setTimeout(typeEffect, 1200);
    }
}

typeEffect();

/*----------------------------fetching Data and  populating Data----------------------------*/ 
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
document.addEventListener("DOMContentLoaded", function() {
  // Article data (you can replace this with your actual data)
  const articles = [
    {
      id: 0,
      title: "Our first office",
      imageUrl: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-1.png",
      description: "Over the past year, Volosoft has undergone many changes! After months of preparation.",
      readTime: "2 minutes",
      link: "#"
    },
    // Add more articles as needed
  ];

  // Function to generate HTML for an article
  function createArticleHTML(article) {
    return `
      <article class="max-w-xs">
        <a href="${article.link}">
          <img src="${article.imageUrl}" class="mb-5 rounded-lg" alt="Image">
        </a>
        <h2 class="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
          <a href="${article.link}">${article.title}</a>
        </h2>
        <p class="mb-4 text-gray-500 dark:text-gray-400">${article.description}</p>
        <a href="${article.link}" class="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline">
          Read in ${article.readTime}
        </a>
      </article>
    `;
  }

  // Get the article container element
  const articleContainer = document.getElementById("articleContainer");

  // Iterate over the articles and append them to the container
  articles.forEach(article => {
    const articleHTML = createArticleHTML(article);
    articleContainer.innerHTML += articleHTML;
  });
});