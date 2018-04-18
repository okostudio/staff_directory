////////////////////////////////////
//
// Tween Nano
//
////////////////////////////////////
var tweenLog = [];

tween = function(_functionType, _element, _time, _object, _ease, _delay){
	if($(_element).css){
		if ($(_element).css('display') == 'none'){
			$(_element).css('display', 'block');
		}
	} 
	var easeType = "Power0.easeIn";
	if(_ease) _ease = _ease.toLowerCase();
	switch(_ease){
		case 'sinein': 		easeType = "Sine.easeIn"; break;
		case 'sineout': 	easeType = "Sine.easeOut"; break;
		case 'sineinout': 	easeType = "Sine.easeInOut"; break;
		case 'pow1in': 		easeType = "Power1.easeIn"; break;
		case 'pow1out': 	easeType = "Power1.easeOut"; break;
		case 'pow1inout': 	easeType = "Power1.easeInOut"; break;
		case 'in': 		easeType = "Power2.easeIn"; break;
		case 'out': 	easeType = "Power2.easeOut"; break;
		case 'inout': 	easeType = "Power2.easeInOut"; break;
		case 'pow3in': 		easeType = "Power3.easeIn"; break;
		case 'pow3out': 	easeType = "Power3.easeOut"; break;
		case 'pow3inout': 	easeType = "Power3.easeInOut"; break;
		case 'pow4in': 		easeType = "Power4.easeIn"; break;
		case 'pow4out': 	easeType = "Power4.easeOut"; break;
		case 'pow4inout': 	easeType = "Power4.easeInOut"; break;
		case 'backin': 	easeType = "Back.easeIn"; break;
		case 'backout': easeType = "Back.easeOut"; break;
		case 'backinout': easeType = "Back.easeInOut"; break;
		case 'bounceout': easeType = "Bounce.easeOut"; break;
		case 'override' : break; // for custom tweens
		case '' : break; // for custom tweens
		default : break;
	}

	if(_ease != 'override') _object.ease = easeType;

	_object.delay = _delay * timeScale;
	_functionType(_element, _time * timeScale, _object);
	tweenLog.push(_element)
}
var timeScale = 1;
function setTweenTime(n){ timeScale = n }
set = TweenLite.set;
from = function(_element, _time, _object, _ease, _delay){tween(TweenLite.from, _element, _time, _object, _ease, _delay)}
to = function(_element, _time, _object, _ease, _delay){tween(TweenLite.to, _element, _time, _object, _ease, _delay)}
wait = function(_time, _function, _params){TweenLite.delayedCall(_time * timeScale, _function, _params);tweenLog.push(_function);}
kill = function(_element){TweenLite.killTweensOf(_element);}
killAll = function(){
	for(i = 0; i < tweenLog.length; ++i){
		kill(tweenLog[i]);
	}
	tweenLog = [];
}

function trace(str){console.log(str)}


function mod(n1,n2){
	return(n1 % n2)
}

/////////////////////////////////
//
//	MOBILE DETECT
//
/////////////////////////////////

var isMobile = false; //initiate as false

function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

//$thing.bind('touchstart', function(event){...})
