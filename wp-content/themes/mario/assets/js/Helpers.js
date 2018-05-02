// 
// 
// 
//	A collection of short functions that do simple functions 
// 

function splitCamelCaseText(str = ""){
    // insert a space before all caps
	str = str.replace(/([A-Z])/g, '&nbsp;$1').substring(6).replace(/U&nbsp;X/i, 'UX');
    return(str);
}



function removeStringFromArray(str, arr){
	let temp = [];
	arr.map(index => {
		if(index != str && index != undefined) temp.push(index);
	})
	return temp;
}

function hide(el){
	document.querySelector(el).style.display = "none";
}