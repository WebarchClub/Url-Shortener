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

// This server URL will change on deploy
// let serverUrl = 'https://webarch-shortener.herokuapp.com';
let serverUrl = 'http://localhost:5000';

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
    const hoverDiv = document.createElement('div');
    hoverDiv.innerText = longUrl;
    hoverDiv.classList.add('hover-div');
    div1.append(hoverDiv);
    div1.classList.add('activate-hover');
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

  li.classList.add('url-list-item');

  div1.append(longUrlLink);
  div2.append(shortUrlLink);

  li.append(div1);
  li.append(div2);

  urlList.prepend(li);
};

const addErrorBox = (message) => {
  errorBox.classList.remove('inactive');
  errorBox.innerText = message;
};

const removeErrorBox = () => {
  errorBox.classList.add('inactive');
};

// Edit input URL as https
const editUrl = (inputUrl) => {
  inputUrl =
    inputUrl.startsWith('https') === true
      ? inputUrl
      : inputUrl.startsWith('www') === true
      ? `https://${inputUrl.slice(4)}`
      : `https://${inputUrl}`;

  return inputUrl;
};

// To fetch all the URLs entered by the user before by making a GET request to the API
const fetchAllShortUrls = async () => {
  // console.log(window.location);

  const response = await fetch(`${serverUrl}/shorten`);

  const data = await response.json();

  const urls = data.data;

  urlList.innerText = urls.length === 0 ? 'No URLs yet' : '';
  urls.forEach((url) => {
    url.longUrl = editUrl(url.longUrl);
    addUrltoList(serverUrl, url.longUrl, url.shortUrl);
  });
};

// To convert a long URL to a short URL by making a POST request to API
const createShortUrl = async (e) => {
  e.preventDefault();

  // to empty the list text 'No URLs yet' after a new URL is added
  if (urlList.innerText === 'No URLs yet') {
    urlList.innerText = '';
  }

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

    inputUrl.value = '';

    longInputUrl = editUrl(longInputUrl);

    let reqBody = {
      longUrl: longInputUrl,
    };

    if (customId.value !== null && customId.value !== '') {
      shortId = customId.value;
      reqBody.shortUrl = shortId;
    }

    customId.value = '';
    const response = await fetch(`${serverUrl}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });

    const data = await response.json();

    addUrltoList(serverUrl, longInputUrl, data.url.shortUrl);
  }
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
        inline: 'nearest',
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
  }
  copyBtn.innerText = 'Copy';
});
copyBtn.addEventListener('click', function () {
  const r = document.createRange();
  r.selectNode(modalShortUrl);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  copyBtn.innerText = 'Copied';
});
