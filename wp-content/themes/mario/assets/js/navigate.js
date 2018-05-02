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
		sortTeams('smile', true);
		teams.sortBy = 'smile';
		$('.nav.sort .button').removeClass('selected')
		$('.nav .happy').addClass('selected')
	})

	document.querySelector('.nav .alpha').addEventListener('click', (e) => {
		sortTeams('alpha', true);
		teams.sortBy = 'alpha';
		$('.nav.sort .button').removeClass('selected')
		$('.nav .alpha').addClass('selected')
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