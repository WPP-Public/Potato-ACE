document.addEventListener('DOMContentLoaded', () => {
	const articleEl =	document.querySelector('article');
	const headingELs = articleEl.querySelectorAll(
		'article > h2,article > h3,article > h4,article > h5,article > h6'
	);

	if (headingELs.length == 0) {
		return;
	}

	const ulEL = document.createElement('ul');
	ulEL.classList.add('toc');
	articleEl.prepend(ulEL);

	headingELs
		.forEach(heading => {
			if (!heading.id) {
				return;
			}
			const aEl = document.createElement('a');
			aEl.href = `#${heading.id}`;
			aEl.textContent = heading.textContent;
			const liEl = document.createElement('li');
			liEl.append(aEl);
			liEl.setAttribute('heading', heading.localName);
			ulEL.append(liEl);
		});
});
