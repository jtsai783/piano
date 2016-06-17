var context = new AudioContext();
var gainNode = context.createGain();
gainNode.connect(context.destination);
gainNode.gain.value = 0.2;
var oscillator = {};
var octave = 0;
var letterLookup = {
	"a": "c",
	"s": "d",
	"d": "e",
	"f": "f",
	"g": "g",
	"h": "a",
	"j": "b",
	"w": "c_s",
	"e": "d_s",
	"t": "f_s",
	"y": "g_s",
	"u": "a_s"
};

var steps = {
	"a": -5,
	"w": -4,
	"s": -3,
	"e": -2,
	"d": -1,
	"f": 0,
	"t": 1,
	"g": 2,
	"y": 3,
	"h": 4,
	"u": 5,
	"j": 6
}

var keysArr = ["a","s","d","f","g","h","j","w","e","t","y","u"];

var freqCalc = function(steps, base){
	if(typeof base === "undefined"){
		base = 440;
	}
	return base * Math.pow(Math.pow(2, (1/12)), steps);
}

var startNoise = function(osc, step){
	osc.type = 'square';
	osc.frequency.value = freqCalc(step);
	osc.connect(gainNode);
	osc.start(0);
}

var restartNoise = function(){
	for(key in oscillator){
		if(typeof oscillator[key] !== "undefined"){
			oscillator[key].stop(0);
			oscillator[key].disconnect();
			oscillator[key] = context.createOscillator();
			startNoise(oscillator[key], steps[key] + 12 * octave);
		}
	}
}

document.body.addEventListener('keydown', function (e) {
	var left;
	if(!oscillator[e.key] && keysArr.includes(e.key)){
		$("#" + letterLookup[e.key]).addClass("active");
		oscillator[e.key] = context.createOscillator();
		startNoise(oscillator[e.key], steps[e.key] + 12 * octave);
	}

	if(e.key === "ArrowRight"){
		if(octave < 2){
			octave = octave + 1;
			left = $('.highlight').css('left');
			$('.highlight').css('left', parseInt(left) - 240);
		};
		restartNoise();

	}

	if(e.key === "ArrowLeft"){
		if(octave > -2){
			octave = octave - 1;
			left = $('.highlight').css('left');
			$('.highlight').css('left', parseInt(left) + 240);
		};
		restartNoise();

	}
});

document.body.addEventListener('keyup', function(e){
	if(keysArr.includes(e.key)){	
		$("#" + letterLookup[e.key]).removeClass("active");
		oscillator[e.key].stop(0);
		oscillator[e.key].disconnect();
		oscillator[e.key] = undefined;
	}
})