const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
		this._englishLenguagePattern = /^[a-zA-Z0-9\s\\\'\"\!\@\#\$\%\^\&\,\.\=\/\?\+\_\*\;\:\`\~\{\}\[\]\(\)\'\-\|]*$/;
		//экранировал все на всякий случай
	}

	set data(url) {
		getData(url)
		.then(data => {
			const dateForFilter = new Date(2020, 9, 10);
			for (let item of data.items) {
				const dateVideoPublishedAt = new Date(item.contentDetails.videoPublishedAt);
				if ((dateVideoPublishedAt.getTime() - dateForFilter.getTime()) > 0) {
					const snippetTitle = item.snippet.title;
					if ((snippetTitle.match(/javascript/i) || snippetTitle.match(/python/i)) && !snippetTitle.match(/basic/i) && this._list.length < 15 && snippetTitle.match(this._englishLenguagePattern)) {
						this._list.push({...item.snippet, ...item.contentDetails});
					}
				}
			}
		}).then(() => {
			this.sortArray(this._list);
		}).catch(() => {
			console.log('erorr');
		});
	}

	get data() { //async getter
		return (async () => {
			try {
			  return await this._list;
			} catch(e) {
			  return 0;
			}
		  })();
	}

	sortArray(arr) {
		arr.sort(function(a, b) {
			const dateA = a.videoPublishedAt;
			const dateB = b.videoPublishedAt;
			if (dateA > dateB) {
				return 1;
			} else if (dateA < dateB) {
				return -1;
			}
		});
	}
}
module.exports = ListOfVideos;