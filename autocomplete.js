// destructuring  properties from config object to pass as configurable property
const createAutocomplete = ({
	root,
	renderOption,
	onOptionSelect,
	inputValue,
	fetchData,
}) => {
	root.innerHTML = `
<label class="mb-6"><strong>Search</strong></label>
<input class="input is-medium is-primary mb-4" type="text" placeholder="Enter your search" />
<div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;
	// selecting elements from the root object
	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	//call fetch request on event with entered search data
	const onInput = async (event) => {
		const items = await fetchData(event.target.value);

		// check if search field is empty - close dropdown and return itself so not to open anything else
		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}

		// toggle dropdown state by adding css class
		dropdown.classList.add('is-active');

		//clear results list if exist
		resultsWrapper.innerHTML = '';

		// loop through results
		for (let item of items) {
			// create <a> as dropdown item with 2 nested elements
			const option = document.createElement('a');

			// add css class
			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(item);

			// listen on a click on particular item to close dropdown, then load search result text into input field and call a function to load full info about that item
			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				onOptionSelect(item);
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
};
