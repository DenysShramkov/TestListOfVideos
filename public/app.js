'use strict';

window.addEventListener('DOMContentLoaded', () => {

	const getData = async (url) => {
		const res = await fetch(url); 
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}
		return await res.json();
	};


	const btn = document.querySelector('#btn');
	btn.addEventListener('click', (e) => {
		e.preventDefault();
		getData('/api/list').then(data => {
			console.log(data);
			renderList(data);
		});
	});


	function renderList(list) {
		const parentList = document.querySelector('#list');
		parentList.innerHTML = ``;
		list.forEach(item => {
			const listItem = document.createElement('li');
			listItem.classList.add('list__item');
			listItem.innerHTML = `
			name: ${item.title} <br> date: ${item.videoPublishedAt} <hr> 
			`;
			parentList.append(listItem);
		});
	}
});