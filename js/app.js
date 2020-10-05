document.querySelector('.body-container').style.overflow = 'hidden';

const $ = (e)=>document.querySelector(e);
const $$ = e => document.querySelectorAll(e);

Node.prototype.on = Node.prototype.addEventListener;
Node.prototype.no = Node.prototype.removeEventListener;

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

const ScrollToView = (node) => {

	if (node.parentElement.scrollHeight > node.parentElement.clientHeight) {
		scroller.scroll({
			top: node.offsetTop + (node.clientHeight / 2) - (node.parentElement.clientHeight / 2),
			left: 0,
			behavior: 'smooth'
		})
	}
}





observable.registerListener(function(val) {
	console.log(val);
});


scroller.on('scroll', (event)=>{
	// (scroller.scrollHeight*3)/4
	// observable.scroll = scroller.scrollTop;
})

const LinkClickListener = (event)=>{
	const to = event.target.attributes.to.value;
	observable.scroll = to;
	ScrollToView($('.' + to));

	$$('.link-wraps div a').forEach(element => element.classList.remove('active'));
	$('.link-wraps div a[to="'+to+'"]').classList.add('active')
}

$$('.link-wraps div a').forEach(element => {
	element.on('click', LinkClickListener)
});

$('.nav-logo').on('click', ()=>{
	const to = 'home-page';
	observable.scroll = to;
	ScrollToView($('.' + to));

	$$('.link-wraps div a').forEach(element => element.classList.remove('active'));
})

$('.btn-explore').on('click', ()=>{
	const to = 'services-page';
	observable.scroll = to;
	ScrollToView($('.' + to));

	$$('.link-wraps div a').forEach(element => element.classList.remove('active'));
	$('.link-wraps div a[to="'+to+'"]').classList.add('active')
})