const formUrl = document.getElementById('urlForm');
const inputUrl = document.getElementById('longUrl');
const urlList = document.getElementById('url-list');

const serverUrl = 'http://localhost:5000/api/v1/shortUrl';

const fetchAllShortUrls = async () => {
  const response = await fetch(serverUrl);

  const data = await response.json();

  const urls = data.data;

  if (urls.length === 0) {
    urlList.innerText = 'No URLS yet';
  } else {
    urlList.innerText = '';
    urls.forEach((url) => {
      let urlItem = document.createElement('li');
      let atag = document.createElement('a');

      url.longUrl =
        url.longUrl.startsWith('https') === true
          ? url.longUrl
          : url.longUrl.startsWith('www') === true
          ? `https://${url.longUrl.slice(4)}`
          : `https://${url.longUrl}`;

      atag.innerText = `https://webarch/${url.shortUrl}`;
      atag.href = url.longUrl;

      urlItem.append(atag);

      urlList.append(urlItem);
    });
  }
};
const getShortUrl = async (e) => {
  e.preventDefault();

  const response = await fetch(serverUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      longUrl: inputUrl.value,
    }),
  });

  inputUrl.value = '';

  const data = await response.json();

  let anchortag = document.createElement('a');
  let li = document.createElement('li');

  anchortag.innerText = `https://webarch/${data.url.shortUrl}`;

  anchortag.href =
    data.url.longUrl.startsWith('https') === true
      ? data.url.longUrl
      : data.url.longUrl.startsWith('www') === true
      ? `https://${data.url.longUrl.slice(4)}`
      : `https://${data.url.longUrl}`;

  li.append(anchortag);
  urlList.append(li);
};

formUrl.addEventListener('submit', getShortUrl);
document.addEventListener('DOMContentLoaded', function () {
  fetchAllShortUrls();
});
