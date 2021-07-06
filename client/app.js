const formUrl = document.getElementById('urlForm');
const inputUrl = document.getElementById('longUrl');
const customId = document.getElementById('shortId');
const urlList = document.getElementById('url-list');
const customIdButton = document.getElementById('custom-btn');
const errorBox = document.getElementById('error-box');
const links = document.getElementsByTagName('a');
const modalClose = document.getElementById('modal-close-button');
const modalBox = document.getElementById('modal-box');
const modalShortUrl = document.getElementById('modal-short-url');
const copyBtn = document.getElementById('copy-button');
const urlCheckbox = document.getElementById('uniqueID');

// This server URL will change on deploy
let serverUrl = 'https://webarch-shortener.herokuapp.com';
// let serverUrl = "http://localhost:5000";

// Helper function to add a URL item to the results
const addUrltoList = (baseUrl, longUrl, shortUrl) => {
	let li = document.createElement('li');
	let shortUrlLink = document.createElement('a');
	let longUrlLink = document.createElement('a');
	let div1 = document.createElement('div');
	let div2 = document.createElement('div');

	baseUrl = baseUrl + '/shorten';

	let shortenedLongUrl;

	if (longUrl.length > 30) {
		shortenedLongUrl = `${longUrl.slice(0, 30)}.....`;
	} else {
		shortenedLongUrl = longUrl;
	}

	shortUrlLink.innerText = `${baseUrl}/${shortUrl}`;
	modalShortUrl.innerText = `${baseUrl}/${shortUrl}`;
	longUrlLink.innerText = shortenedLongUrl;
	shortUrlLink.href = longUrl;
	longUrlLink.href = longUrl;
	shortUrlLink.target = '_blank';
	longUrlLink.target = '_blank';

	const urlListCopyBtn = document.createElement('button');

	urlListCopyBtn.innerText = 'Copy';
	urlListCopyBtn.classList.add('copy-btn');

	// console.log(urlListCopyBtn);

	li.classList.add('url-list-item');

	div1.append(longUrlLink);
	div2.append(shortUrlLink);

	li.append(div1);
	li.append(div2);
	li.append(urlListCopyBtn);

	urlListCopyBtn.addEventListener('click', () => {
		const body = document.querySelector('body');
		const area = document.createElement('textarea');

		body.appendChild(area);
		area.value = shortUrlLink.innerText;
		area.select();
		document.execCommand('copy');

		urlListCopyBtn.innerText = 'Copied';

		body.removeChild(area);

		console.log('area value', area.value);
	});

	urlList.prepend(li);
};

const addErrorBox = (message) => {
	errorBox.classList.remove('inactive');
	errorBox.innerText = message;
};

const removeErrorBox = () => {
	errorBox.classList.add('inactive');
};

const addHeadingsToList = () => {
	const li = document.createElement('li');
	const h1 = document.createElement('h3');
	const h2 = document.createElement('h3');

	h1.innerText = `Full URL`;
	h2.innerText = `Short URL`;

	li.append(h1);
	li.append(h2);
	// li.classList.add('url-list-item');
	li.id = 'url-heading';

	urlList.prepend(li);
};

// Edit input URL as https
const editUrl = (inputUrl) => {
	inputUrl =

			inputUrl.startsWith('https') === true ? inputUrl :
			inputUrl.startsWith('www') === true ? `https://${inputUrl.slice(4)}` :
			`https://${inputUrl}`;

	return inputUrl;
};

// To fetch all the URLs entered by the user before by making a GET request to the API
const fetchAllShortUrls = async () => {
	// console.log(window.location);

	const response = await fetch(`${serverUrl}/shorten`);

	const data = await response.json();

	let urls = data.data;

	urlList.innerText =

			urls.length === 0 ? 'No URLs yet' :
			'';

	//  To get only the last 10 newly added URLs
	urls = urls.slice(Math.max(urls.length - 10, 0));

	urls.forEach((url) => {
		url.longUrl = editUrl(url.longUrl);
		addUrltoList(serverUrl, url.longUrl, url.shortUrl);
	});

	// add the headings dynamically
	addHeadingsToList();
};

// To convert a long URL to a short URL by making a POST request to API
const createShortUrl = async (e) => {
	e.preventDefault();

	// to empty the list text 'No URLs yet' after a new URL is added

	let longInputUrl = inputUrl.value;

	// check for url validation
	if (longInputUrl === '') {
		addErrorBox('Please add a URL, field cannot be empty');
	} else {
		// if there is an existing error, remove it
		if (!errorBox.classList.contains('inactive')) {
			removeErrorBox();
		}

		if (modalBox.classList.contains('inactive')) {
			modalBox.classList.remove('inactive');
		}

		console.log(urlList.innerText);

		if (urlList.innerText.includes('No URLs yet')) {
			urlList.innerText = '';
		} else {
			const urlHeading = document.getElementById('url-heading');
			if (urlHeading !== null) urlHeading.remove();
		}

		inputUrl.value = '';

		longInputUrl = editUrl(longInputUrl);

		let reqBody = {
			longUrl: longInputUrl
		};

		if (customId.value !== null && customId.value !== '') {
			shortId = customId.value;
			reqBody.shortUrl = shortId;
		}

		// check the state of the make private checkbox
		const isChecked =

				urlCheckbox.checked === true ? true :
				false;

		reqBody.isPrivate = isChecked;

		customId.value = '';
		const response = await fetch(`${serverUrl}/shorten`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(reqBody)
		});

		const data = await response.json();

		// if checkbox is checked then no need to add it to the URL list
		if (urlCheckbox.checked === false) {
			addUrltoList(serverUrl, longInputUrl, data.url.shortUrl);
		} else {
			// just add the private url to the modal and not the list
			modalShortUrl.innerText = `${serverUrl}/shorten/${data.url.shortUrl}`;
		}

		// add the headings dynamically
		addHeadingsToList();
	}
};

const copyLinkToClipboard = () => {
	const r = document.createRange();
	r.selectNode(modalShortUrl);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(r);
	document.execCommand('copy');
	window.getSelection().removeAllRanges();
	copyBtn.innerText = 'Copied';
};
// To remove the #section-id from url
Array.prototype.forEach.call(links, function (elem, index) {
	//Get the hyperlink target and if it refers to an id go inside condition
	const elemAttr = elem.getAttribute('href');
	if (elemAttr && elemAttr.includes('#')) {
		//Replace the regular action with a scrolling to target on click
		elem.addEventListener('click', function (ev) {
			ev.preventDefault();
			//Scroll to the target element using replace() and regex to find the href's target id
			document.getElementById(elemAttr.replace(/#/g, '')).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest'
			});
		});
	}
});

// Event Listeners
formUrl.addEventListener('submit', createShortUrl);
document.addEventListener('DOMContentLoaded', function () {
	fetchAllShortUrls();
});
customIdButton.addEventListener('click', (e) => {
	e.preventDefault();
	if (customId.classList.contains('inactive')) {
		customId.classList.remove('inactive');
		customIdButton.innerText = 'Hide alias input';
	} else {
		customId.classList.add('inactive');
		customId.value = '';
		customIdButton.innerText = 'Make custom alias';
	}
});
modalClose.addEventListener('click', function () {
	if (!modalBox.classList.contains('inactive')) {
		modalBox.classList.add('inactive');
		modalShortUrl.innerText = '';
	}
	copyBtn.innerText = 'Copy';
});
copyBtn.addEventListener('click', copyLinkToClipboard);
// urlListCopyBtn.addEventListener("click", copyLinkToClipboard);
