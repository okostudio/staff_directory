function processAjaxData(response, urlPath){
	document.getElementById("content").innerHTML = response.html;
	document.title = response.pageTitle;
	window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
}

 window.onpopstate = function(e){
	if(e.state){
		document.getElementById("content").innerHTML = e.state.html;
		document.title = e.state.pageTitle;
	}
};

function setNewPage(state, title, url){
	histrory.pushState({
		state
	}, 'Staff Directory | ' + title, url)
}

function initNav(){

	document.querySelector('.nav .happy').addEventListener('click', (e) => {
		window.open(location.origin + "/smile-index/","_self");
	})

	document.querySelector('.nav .alpha').addEventListener('click', (e) => {
		window.open(location.origin + "/a-z/","_self");
	})

	// !!!!!!!!!!! IN DEVELOPMENT !!!!!!!!!!!!!!!!!!!!!

	// function $(el){
	// 	return document.querySelector(el);
	// }

	// $('.teams').addEventListener('click', () =>{
	// 	console.log($('.selected'))
	// 	$('.selected').classList.remove('selected');
	// 	// this.classList.add('selected');
	// 	console.log(this);

	// 	setNewPage({
	// 		id: 'homepage'
	// 	}, 'A-Z', 'http://staff.loc/jizz')
	// })
}