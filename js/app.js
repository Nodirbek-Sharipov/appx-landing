const $ = e =>document.querySelector(e);
const $$ = e => document.querySelectorAll(e);

Node.prototype.on = Node.prototype.addEventListener;
window.on = window.addEventListener;

Node.prototype.scroll = window.scroll

let scroller = $('.body-container');
let services_scroller = $('.service-slider-wrap');

observable_main = {
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

observable_services = {
	aInternal: 'slide-item-web',

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

observable_last_slided = {
	aInternal: 0,

	aListener: function(val) {},

	set time(val) {
		this.aInternal = val;
		this.aListener(val);
	},

	get time() {
		return this.aInternal;
	},

	registerListener: function(listener) {
		this.aListener = listener;
	}
}

let isManualScroll = true;
let toUp; // scroll direction
let canScroll = true; // allow scrolling or not
let canScrollService = true;

const ScrollToView = (node) => {
	isManualScroll = true
	if (node.parentElement.scrollHeight > node.parentElement.clientHeight) {
		node.parentElement.scroll({
			top: node.offsetTop + (node.clientHeight / 2) - (node.parentElement.clientHeight / 2),
			left: 0,
			behavior: 'smooth'
		})
	}
}

const ScrollToViewHorizontally = (node) => {
	// isManualScroll = true
	// if (node.parentElement.scrollWidth > node.parentElement.scrollWidth) {
		node.parentElement.scroll({
			top: 0,
			left: (node.offsetLeft - node.parentElement.offsetLeft) + (node.clientWidth / 2) - (node.parentElement.clientWidth / 2),
			behavior: 'smooth'
		})
	// }
}


const ScrollToPrevious = ()=>{
	canScroll = false;
	setTimeout(() => {
		canScroll = true
	}, 1000);
	switch(observable_main.scroll) {
		case 'services-page':
			observable_main.scroll = 'home-page';
			break;
		case 'projects-page':
			observable_main.scroll = 'services-page';
			break;
		case 'contacts-page':
			observable_main.scroll = 'projects-page';
			break;
	}
};
const ScrollToNext = ()=>{
	canScroll = false;
	setTimeout(() => {
		canScroll = true
	}, 1000);
	switch(observable_main.scroll) {
		case 'home-page':
			observable_main.scroll = 'services-page';
			break;
		case 'services-page':
			observable_main.scroll = 'projects-page';
			break;
		case 'projects-page':
			observable_main.scroll = 'contacts-page';
			break;
	}
};

const ScrollToPreviousService = ()=>{
	canScrollService = false;
	setTimeout(() => {
		canScrollService = true
	}, 1000);
	switch(observable_services.scroll) {
		case 'slide-item-web':
			observable_services.scroll = 'slide-item-ui';
			break;
		case 'slide-item-mobile':
			observable_services.scroll = 'slide-item-web';
			break;
		case 'slide-item-ui':
			observable_services.scroll = 'slide-item-mobile';
			break;
	}
};
const ScrollToNextService = ()=>{
	canScrollService = false;
	setTimeout(() => {
		canScrollService = true
	}, 1000);
	switch(observable_services.scroll) {
		case 'slide-item-web':
			observable_services.scroll = 'slide-item-mobile';
			break;
		case 'slide-item-mobile':
			observable_services.scroll = 'slide-item-ui';
			break;
		case 'slide-item-ui':
			observable_services.scroll = 'slide-item-web';
			break;
	}
};

window.on('resize', ()=>{
	ScrollToView($('.' + observable_main.scroll))
	ScrollToViewHorizontally($('.' + observable_services.scroll))
})


const SetActiveLink = to =>{
	$$('.link-wraps div a').forEach(element => element.classList.remove('active'));
	(to !== 'home-page') && $('.link-wraps div a[to="'+to+'"]').classList.add('active');
}

const SetActiveServiceLink = to =>{
	$$('.slider-link-wrap div').forEach(element => element.classList.remove('active'));
	$('.slider-link-wrap div[to="'+to+'"]').classList.add('active');
}

observable_main.registerListener(function(val) {

	ScrollToView($('.' + val));
	SetActiveLink(val);

	setTimeout(()=>{
		if(val === 'home-page' || val === 'projects-page'){
			document.documentElement.style.setProperty("--nav-text-color", "#0A0A0A");
		}

		if(val === 'services-page' || val === 'contacts-page'){
			document.documentElement.style.setProperty("--nav-text-color", "#FAFAFA");
		}
	}, 300)
});

observable_services.registerListener(function(val) {
	observable_last_slided.time = 0;
	ScrollToViewHorizontally($('.' + val))
	SetActiveServiceLink(val)
})

observable_last_slided.registerListener(function(val) {
	if(val === 5){
		// disabled auto-scroll slide-show
		// ScrollToNextService();
	}
})


scroller.on('wheel', (event) => {
	event.preventDefault();

	const magnitude = 20; // how fast the page is scrolled
	toUp = event.wheelDeltaY > 0
	if(isManualScroll){
		if(event.deltaY < -magnitude && canScroll) { // to top
			ScrollToPrevious();
		}

		if(event.deltaY > magnitude && canScroll) { // to bottom
			ScrollToNext();
		}
	}
});

services_scroller.on('wheel', (event) => {
	event.preventDefault();

	const magnitude = 20;
	toBack = event.wheelDeltaX > 0

	if(true){
		if(event.deltaX < -magnitude && canScrollService) { // go back
			ScrollToPreviousService();
		}

		if(event.deltaX > magnitude && canScrollService) { // go forwards
			ScrollToNextService();
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

let touchStartXServices, touchEndXServices;

services_scroller.on('touchstart', (event)=>{
	touchStartXServices = event.touches[0].clientX;
})

services_scroller.on('touchend', (event)=>{
	touchEndXServices = event.changedTouches[0].clientX;

	let difference = touchEndXServices - touchStartXServices

	const magnitude = 80; // how fast the screen is swiped

	if(difference > 0 && Math.abs(difference) > magnitude){ // up
		ScrollToPreviousService();
	}

	if(difference < 0  && Math.abs(difference) > magnitude){ // down
		ScrollToNextService();
	}
})

setInterval(()=>{
	observable_last_slided.time = observable_last_slided.time + 1
}, 1000)


$$('.link-wraps div a').forEach(element => {
	element.on('click', (event)=>{
		observable_main.scroll = event.target.attributes.to.value;
	})
});

$('.nav-logo').on('click', ()=>{
	observable_main.scroll = 'home-page';
})

$('.btn-explore').on('click', ()=>{
	observable_main.scroll = 'services-page';
})

$$('.slider-link-item').forEach(element => {
	element.on('click', (event)=>{
		observable_services.scroll = event.target.attributes.to.value;
	})
});
