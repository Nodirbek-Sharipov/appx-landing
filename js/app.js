document.querySelector('.body-container').style.overflow = 'hidden';

const $ = e =>document.querySelector(e);
const $$ = e => document.querySelectorAll(e);

Node.prototype.on = Node.prototype.addEventListener;
window.on = window.addEventListener;

Node.prototype.scroll = window.scroll

let scroller = $('.body-container');

observable = {
	aInternal: 'home-page',

	aListener: function(val) {},

	set scroll(val) {
		this.aInternal = val;
		this.aListener(val);
	},

	get scroll() {
		return this.aInternal;
	},

	registerListener: function(listener) {
		this.aListener = listener;
	}
}

let isManualScroll = true;
let toUp; // scroll direction
let canScroll = true; // allow scrolling or not

const ScrollToView = (node) => {
	isManualScroll = true
	if (node.parentElement.scrollHeight > node.parentElement.clientHeight) {
		scroller.scroll({
			top: node.offsetTop + (node.clientHeight / 2) - (node.parentElement.clientHeight / 2),
			left: 0,
			behavior: 'smooth'
		})
	}
}

const ScrollInstantly = (node) => {
	if (node.parentElement.scrollHeight > node.parentElement.clientHeight) {
		scroller.scroll({
			top: node.offsetTop + (node.clientHeight / 2) - (node.parentElement.clientHeight / 2),
			left: 0,
		})
	}
}

const ScrollToPrevious = ()=>{
	canScroll = false;
	setTimeout(() => {
		canScroll = true
	}, 500);
	switch(observable.scroll) {
		case 'services-page':
			observable.scroll = 'home-page';
			break;
		case 'projects-page':
			observable.scroll = 'services-page';
			break;
		case 'contacts-page':
			observable.scroll = 'projects-page';
			break;
	}
};
const ScrollToNext = ()=>{
	canScroll = false;
	setTimeout(() => {
		canScroll = true
	}, 500);
	switch(observable.scroll) {
		case 'home-page':
			observable.scroll = 'services-page';
			break;
		case 'services-page':
			observable.scroll = 'projects-page';
			break;
		case 'projects-page':
			observable.scroll = 'contacts-page';
			break;
	}
};

window.on('resize', ()=>{
	ScrollToView($('.' + observable.scroll))
})


const SetActiveLink = to =>{
	$$('.link-wraps div a').forEach(element => element.classList.remove('active'));
	(to !== 'home-page') && $('.link-wraps div a[to="'+to+'"]').classList.add('active');
}

observable.registerListener(function(val) {

	ScrollToView($('.' + val));
	SetActiveLink(val);

	if(val === 'home-page' || val === 'projects-page'){
		setTimeout(()=>{
			document.documentElement.style.setProperty("--nav-text-color", "#0A0A0A");
		}, 300)
	}

	if(val === 'services-page' || val === 'contacts-page'){
		setTimeout(()=>{
			document.documentElement.style.setProperty("--nav-text-color", "#FAFAFA");
		}, 300)
	}
});


scroller.on('wheel', (event) => {
	event.preventDefault();

	const magnitude = 30; // how fast the page is scrolled
	toUp = event.wheelDelta > 0
	if(isManualScroll){
		if(event.deltaY < -magnitude && canScroll) { // to top
			ScrollToPrevious();
		}

		if(event.deltaY > magnitude && canScroll) { // to bottom
			ScrollToNext();
		}
	}
});

let touchStartY, touchEndY;

scroller.on('touchstart', (event)=>{
	touchStartY = event.touches[0].clientY;
})

scroller.on('touchend', (event)=>{
	touchEndY = event.changedTouches[0].clientY;

	let difference = touchEndY - touchStartY

	const magnitude = 80; // how fast the screen is swiped

	if(difference > 0 && Math.abs(difference) > magnitude){ // up
		ScrollToPrevious();
	}

	if(difference < 0  && Math.abs(difference) > magnitude){ // down
		ScrollToNext();
	}
})

const LinkClickListener = (event)=>{
	const to = event.target.attributes.to.value;
	observable.scroll = to;
}

$$('.link-wraps div a').forEach(element => {
	element.on('click', LinkClickListener)
});

$('.nav-logo').on('click', ()=>{
	const to = 'home-page';
	observable.scroll = to;
})

$('.btn-explore').on('click', ()=>{
	const to = 'services-page';
	observable.scroll = to;
})