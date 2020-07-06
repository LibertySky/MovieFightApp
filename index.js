const autoCompleteConfig = {
	renderOption(movie) {
		// check if there is a movie poster, if not - set empty
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
		<img src="${imgSrc}" />
		${movie.Title} /${movie.Year}/`;
	},

	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
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
	},
};

createAutocomplete({
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.getElementById('left-summary'), 'left');
	},
});
createAutocomplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.getElementById('right-summary'), 'right');
	},
});

let leftMovie;
let rightMovie;

// function to fetch & print detailed info about the movie after search
const onMovieSelect = async (movie, summaryElement, side) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '24449abe',
			i: movie.imdbID,
		},
	});
	// Select div in the DOM where to insert movieTemplate with search results
	summaryElement.innerHTML = movieTemplate(response.data);

	if (side === 'left') {
		leftMovie = response.data;
	} else {
		rightMovie = response.data;
	}

	if (leftMovie && rightMovie) {
		runComparison();
	}
};

// compare both sides
const runComparison = () => {
	const leftSideStats = document.querySelectorAll(
		'#left-summary .notification'
	);
	const rightSideStats = document.querySelectorAll(
		'#right-summary .notification'
	);
	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];
		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);
		if (rightSideValue > leftSideValue) {
			leftStat.classList.add('is-warning');
		} else {
			rightStat.classList.add('is-warning');
		}
	});
};

// function to print movie details to the DOM
const movieTemplate = (movieDetail) => {
	// movie comparison
	const dollars = parseInt(
		//extract number from a BoxOffice string
		movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
	);

	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);
		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

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
<article class="notification" data-value=${awards}>
	<p class="subtitle">Awards</p>
	<p class="title">${movieDetail.Awards}</p>
</article>
<article class="notification" data-value=${dollars}>
	<p class="subtitle">Box Office</p>	
	<p class="title">${movieDetail.BoxOffice}</p>
</article>
<article class="notification" data-value=${metascore}>
	<p class="subtitle">Metascore</p>
	<p class="title">${movieDetail.Metascore}</p>
</article>
<article class="notification" data-value=${imdbRating}>
	<p class="subtitle">IMDB Rating</p>
	<p class="title">${movieDetail.imdbRating}</p>
</article>
<article class="notification" data-value=${imdbVotes}>
	<p class="subtitle">IMDB Votes</p>
	<p class="title">${movieDetail.imdbVotes}</p>
</article>
	`;
};
