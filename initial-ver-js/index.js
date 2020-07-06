//fetch http request with axios library
const fetchData = async (searchTerm) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '24449abe',
			s: searchTerm,
		},
	});
	//  catch an error when status is OK but movie not found
	if (response.data.Error) {
		return [];
	}

	return response.data.Search;
};

// select container in a DOM and nest it with some html
const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label class="mb-6"><strong>Search for a Movie</strong></label>
<input class="input is-medium is-primary mb-4" type="text" placeholder="Movie" />
<div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

//call fetch request on event with entered search data
const onInput = async (event) => {
	const movies = await fetchData(event.target.value);

	// check if search field is empty - close dropdown and return itself so not to open anything else
	if (!movies.length) {
		dropdown.classList.remove('is-active');
		return;
	}

	// toggle dropdown state by adding css class
	dropdown.classList.add('is-active');

	//clear results list if exist
	resultsWrapper.innerHTML = '';

	// loop through results
	for (let movie of movies) {
		// create <a> as dropdown item with 2 nested elements
		const option = document.createElement('a');

		// check if there is a movie poster, if not - set empty
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

		// add css class
		option.classList.add('dropdown-item');
		option.innerHTML = `
      <img src="${imgSrc}" />
      ${movie.Title}
		`;

		// listen on a click on particular movie to close dropdown, then load search result text into input field and call a function to load full info about that movie
		option.addEventListener('click', () => {
			dropdown.classList.remove('is-active');
			input.value = movie.Title;
			onMovieSelect(movie);
		});

		// insert created <a> item in results container
		resultsWrapper.appendChild(option);
	}
};
input.addEventListener('input', debounce(onInput, 800));

// Event listener for the click outside of dropdown menu to close it
document.addEventListener('click', (event) => {
	if (!root.contains(event.target)) {
		dropdown.classList.remove('is-active');
	}
});

// function to fetch & print detailed info about the movie after search
const onMovieSelect = async (movie) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '24449abe',
			i: movie.imdbID,
		},
	});
	// Select div in the DOM where to insert movieTemplate with search results
	document.getElementById('summary').innerHTML = movieTemplate(response.data);
};

// function to print movie details to the DOM
const movieTemplate = (movieDetail) => {
	return `
	<article class="media">
	<figure class="media-left">
		<p class="image">
			<img src="${movieDetail.Poster}" alt="Movie Poster" />
		</p>
	</figure>
	<div class="media-content">
		<div class="content">
			<h1>${movieDetail.Title}</h1>
			<h4>${movieDetail.Genre}</h4>
			<p>${movieDetail.Plot}</p>
		</div>
	</div>
</article>
<article class="notification">
	<p class="subtitle">Awards</p>
	<p class="title">${movieDetail.Awards}</p>
</article>
<article class="notification">
	<p class="subtitle">Box Office</p>	
	<p class="title">${movieDetail.BoxOffice}</p>
</article>
<article class="notification">
	<p class="subtitle">Metascore</p>
	<p class="title">${movieDetail.Metascore}</p>
</article>
<article class="notification">
	<p class="subtitle">IMDB Votes</p>
	<p class="title">${movieDetail.imdbVotes}</p>
</article>
	`;
};
