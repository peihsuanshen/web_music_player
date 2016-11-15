var audio, uploadFile, idName;

//Hide Pause Initially
$('#pause').hide();

//Upload local files
function makeFileList() {
		var input = document.getElementById("audio-upload");
		var ul = document.getElementById("playlist");
		//while (ul.hasChildNodes()) {
	  // 	ul.removeChild(ul.firstChild);
		//}
		for (var i = 0; i < input.files.length; i++) {
			var li = document.createElement("li");
			idName = input.files[i].name.replace(/\.mp3$/i,'');
			li.setAttribute('song' , input.files[i].name);
			li.setAttribute('id' , idName);

			li.innerHTML = idName;
			//li.setAttribute('song', the_url);
			ul.appendChild(li);
		}
		if(!ul.hasChildNodes()) {
			var li = document.createElement("li");
			li.innerHTML = 'No Files Selected';
			ul.appendChild(li);
		}
		//readFiles(this);
		initAudio($('#playlist li:first-child'));
}
/*
function readFiles(file){
	var reader = new FileReader();
	reader.onload = function(event){
		//alert('here');
		//$('idName').attr('src', event.target.result);
		//$('idName').attr('song', event.target.result);
	}
	reader.readAsDataURL(file);
}

$('#audio-upload').change(function(e){
	  readFiles(this.files[0]);
    //uploadFile = e.currentTarget.files[0];
    //$("#filename").text(uploadFile.name);
});
*/

/*
var audioFiles = document.getElementById("audio-upload");
var reader = new FileReader();
//alert(audioFiles.files[0].name);
audioFiles.addEventListener("drop", function (evt) {
						evt.preventDefault();
						evt.stopPropagation();
						var files = evt.dataTransfer.files;
						for (var i = 0, f; f = files[i]; i++) {
								//reader.readAsDataURL(audioFiles.files.item(i));
								var name = audioFiles.files.item(i).name;
								var li = document.createElement('li');
								//li.innerHTML = "<li>" + escape(f.name) + "</li>";
								li.innerHTML = "<li>" + name + "</li>";
								document.getElementById("playlist").appendChild(li);
						}
						console.log("Dropped File");
				}, false);
				*/

//Initializer - Play First Song
//initAudio($('#playlist li:first-child'));

function initAudio(element){
	var song = element.attr('song');
	//alert(song);
	//var song = uploadFile.name
  var title = element.attr('id');
  //var cover = element.attr('cover');
  //var artist = element.attr('artist');
  //var progressBar = element.attr('progressBar');
	//Create a New Audio Object
	//audio = new Audio('media/' + song);
	audio = new Audio(song);
  if(!audio.duration || !audio.currentTime){
		$('#duration').html('0:00');
		$('#duration-left').html('0:00');
	}

	$('#audio-player .title').text(title);
  //$('#audio-player .artist').text(artist);

	//Insert Cover Image
	//$('img.cover').attr('src','images/covers/' + cover);

	$('#playlist li').removeClass('active');
    element.addClass('active');
}
//Time Duration
function showDuration(){
	$(audio).bind('timeupdate', function(){
		//Get hours and minutes

		if(!audio.duration){
			var sl = 0;
			var ml = 0;
		}
		else {
			sl = parseInt((audio.duration) % 60);
			ml = parseInt(((audio.duration ) / 60) % 60);
		}
		if (sl < 10) {
			sl = '0' + sl;
		}
		$('#duration-left').html(ml + ':' + sl);

		var s = parseInt(audio.currentTime % 60);
		var m = parseInt((audio.currentTime / 60) % 60);
		//Add 0 if seconds less than 10
		if (s < 10) {
			s = '0' + s;
		}
		$('#duration').html(m + ':' + s);
		$("#progress").attr("max", audio.duration);

		var value = 0;
		if (audio.currentTime > 0) {
			value = Math.floor((100 / audio.duration) * audio.currentTime);
		}
		//$('#progress').css('width',((audio.currentTime / audio.duration)*100)+'%');
    showValue(audio.currentTime);
		if (audio.currentTime == audio.duration) {
			playNext();
		}

	});
}
/*progressBar = setInterval(function()
    {
        //$('#progress .progress-bar').css({'width',value+'%'});
				$('#progress').click(function(){
					audio.currentTime = this.value;
					$("#progress").attr("max", audio.duration);
					//$('#progress').css('width',value+'%');
				});
    }, 1000);*/
//Progress Control
$('#progress').change(function(){
	audio.currentTime = this.value;
	var width = audio.currentTime / audio.duration * 233;
	$("#progress[type='range']::-webkit-slider-thumb").css('width' , width + 'px');
	showDuration();
	//$("#progress").val(this.value);
	//$('#progress').css('width',((audio.currentTime / audio.duration)*100)+'%');
	//$("#progress::-webkit-slider-thumb").css('width',((audio.currentTime / audio.duration)*100)+'%');
	//$("#progress::-webkit-slider-thumb").css('',((audio.currentTime / audio.duration)*100)+'%');
	//$('#progress').css('width',value+'%');
});
function showValue(val){
	var fill = document.getElementById('sliderfill');
	var slider = document.getElementById('sliderthumb');
	var barWidth = document.getElementById('progress');
	var pc = val/(audio.duration)*100*0.7;
	fill.style.borderRadius = 4 + 'px';
	fill.style.width = (pc + '%'); //(vertical ? fillsize : loc + (thumbsize/2)) + "px";
	var width = val/(audio.duration) * barWidth.offsetWidth + fill.offsetLeft;
	slider.style.left = (width + 'px') ;
}
function setValue(val) {
	document.getElementById('progress').value = val;
	showValue(val);
}
document.addEventListener('DOMContentLoaded', function(){
  setValue(0);
})
//Play Button
$('#play').click(function(){
	audio.play();
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();
});

//Pause Button
$('#pause').click(function(){
	audio.pause();
	$('#pause').hide();
	$('#play').show();
});

//Stop Button
$('#stop').click(function(){
	audio.pause();
	audio.currentTime = 0;
	$('#pause').hide();
	$('#play').show();
	$('#duration').fadeOut(400);
});

//Next Button
$('#next').click(function(){
    audio.pause();
    var next = $('#playlist li.active').next();
    if (next.length == 0) {
        next = $('#playlist li:first-child');
    }
    initAudio(next);
	audio.play();
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();
});

//Prev Button
$('#prev').click(function(){
    audio.pause();
    var prev = $('#playlist li.active').prev();
    if (prev.length == 0) {
        prev = $('#playlist li:last-child');
    }
    initAudio(prev);
	audio.play();
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();
});

//Playlist Song Click
$('#playlist li').click(function () {
    audio.pause();
    initAudio($(this));
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	audio.play();
	showDuration();
});

//Play next song
function playNext(){
	var next = $('#playlist li.active').next();
	if (next.length == 0) {
			next = $('#playlist li:first-child');
	}
	initAudio(next);
  audio.play();
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();
}


//Volume Control
$('#volume').change(function(){
	audio.volume = parseFloat(this.value / 10);
});
