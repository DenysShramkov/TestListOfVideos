'use strict';

const getData = async (url) => {
	const res = await fetch(url); 
	if (!res.ok) {
		throw new Error(`Could not fetch ${url}, status: ${res.status}`);
	}
	return await res.json();
};


class ListOfVideos {
	constructor() {
		this._list = [];
	}

	set data(url) {
		getData(url)
		.then(data => {
			const dateForFilter = new Date(2020, 9, 10);
			for (let item of data.items) {
				const dateVideoPublishedAt = new Date(item.contentDetails.videoPublishedAt);
				if ((item.snippet.title.match(/javascript/i) || item.snippet.title.match(/python/i)) && !item.snippet.title.match(/basic/i) && this._list.length < 15 && item.snippet.title.match(/^[a-zA-Z0-9\s\\\'\"\!\@\#\$\%\^\&\,\.\=\/\?\+\_\*\;\:\`\~\{\}\[\]\(\)\'\-\|]*$/)) {
					//экранировал все на всякий случай
					if ((dateVideoPublishedAt.getTime() - dateForFilter.getTime()) > 0) {
						this._list.push({...item.snippet, ...item.contentDetails});
					}
				}
			}
		}).then(() => {
			this._list.sort(function(a, b) {
				const dateA = a.videoPublishedAt;
				const dateB = b.videoPublishedAt;
				if (dateA > dateB) {
					return -1;
				} else if (dateA < dateB) {
					return 1;
				}
			});
		});
	}

	get data() {
		return this._list;
	}
}

const newListOfVideos = new ListOfVideos();
newListOfVideos.data = 'https://youtube.googleapis.com/youtube/v3/playlistItems?fields=items(snippet(title),contentDetails(videoPublishedAt))&part=snippet,contentDetails&maxResults=200&playlistId=PL5CaGd7qPVW8Paw3aSfAwpnnoqvGNwbdN&key=AIzaSyCDVgQiEkmFhoiLFJDRAZlMrPs2jHvvi8A';

console.log(newListOfVideos.data);