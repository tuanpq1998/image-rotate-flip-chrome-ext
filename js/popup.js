var rotateImage = (deg) => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		var tabId = tabs[0].id;
		chrome.tabs.executeScript(tabId,{
			code: 'document.querySelector("img").style.cursor = "unset!important"; var current = document.querySelector("img").style.transform;'
				+' document.querySelector("img").style.transform = "rotate(' + deg +'deg) " + current.replace(/rotate\\(-?\\d+deg\\)/g ,"")' });
		document.getElementById("slider-input").value = deg;
		document.getElementById("manual-input").value = deg;
		var obj = {};
		obj['image-rotate-'+tabId] = deg;
		chrome.storage.local.set(obj, function() {
			//console.log('Settings saved', obj);
		});
	});	
};


var flipImage = (way, isCheck) => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		var tabId = tabs[0].id;
		var script = "document.querySelector('img').style.cursor = 'unset!important';document.querySelector(\"img\").style.transform";
		var xory = '', obj = {};
		if (way == 'X') {
			xory = '"scaleX(-1)"';
			obj['image-scaleX-'+tabId] = isCheck;
		} else {
			xory = '"scaleY(-1)"';
			obj['image-scaleY-'+tabId] = isCheck;
		} 
		script += ("+= " + xory);
		chrome.tabs.executeScript(tabId,{code: script });
		chrome.storage.local.set(obj, function() {
			//console.log('Settings saved', obj);
		});
	});	
}

window.addEventListener('DOMContentLoaded', () => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		var tabId = tabs[0].id, keyRotate = 'image-rotate-' + tabId, 
			keyScaleX = "image-scaleX-" + tabId, 
			keyScaleY = "image-scaleY-" + tabId;
			
		chrome.storage.local.get([keyRotate, keyScaleX, keyScaleY], function(item) {
			//console.log(item);
			var deg = item[keyRotate];
			document.getElementById("slider-input").value = deg ? deg : 0;
			document.getElementById("manual-input").value = deg ? deg : 0;
			document.getElementById("flipX").checked = item[keyScaleX];
			document.getElementById("flipY").checked = item[keyScaleY];
			
			
		});
	});
  
	var range = document.getElementById("slider-input");
	range.oninput = function() {
		var value = this.value;
		rotateImage(value);
	};

	var manual = document.getElementById("manual-input");
	manual.oninput = function() {
		var value = Number(this.value);
		while (value >= 180 ) value-=360;
		while (value <= -180) value+=360;
		rotateImage(value);
	}

	var reset = document.getElementById("reset");
	reset.onclick = () => {
		rotateImage(0);
	};

	var rotate90 = document.getElementById("rotate90");
	rotate90.onclick = () => {
		rotateImage(90);
	};
	
	var rotateP90 = document.getElementById("rotate-90");
	rotateP90.onclick = () => {
		rotateImage(-90);
	};
	
	var rotate180 = document.getElementById("rotate180");
	rotate180.onclick = () => {
		rotateImage(180);
	};
	
	var rotateP180 = document.getElementById("rotate-180");
	rotateP180.onclick = () => {
		rotateImage(-180);
	};
	
	var flipX = document.getElementById("flipX");
	flipX.onclick = () => {
		flipImage('X', flipX.checked);
	}
	
	var flipY = document.getElementById("flipY");
	flipY.onclick = () => {
		flipImage('Y', flipY.checked);
	}

	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		chrome.tabs.sendMessage( tabs[0].id, {from: 'popup', subject: 'ImageURL check'}, showControl => {
			if (showControl.text.indexOf("image") >= 0) {
				document.querySelector(".image-control").style="display: block";
				document.querySelector("#alert").style="display: none";
			}
        });
	});

});


var download = document.getElementById("download");
download.onclick = () => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		var tabId = tabs[0].id, keyRotate = 'image-rotate-' + tabId, 
		keyScaleX = "image-scaleX-" + tabId, 
		keyScaleY = "image-scaleY-" + tabId;
		var rotate, flipX, flipY;
		chrome.storage.local.get([keyRotate, keyScaleX, keyScaleY], function(item) {
			//console.log(item);
			rotate = item[keyRotate] ? Number(item[keyRotate]) : 0;
			flipX = item[keyScaleX];
			flipY = item[keyScaleY];				
			//console.log(rotate);
			
			var imageType;
			chrome.tabs.sendMessage( tabs[0].id, {from: 'popup', subject: 'ImageURL check'}, showControl => {
				imageType = showControl.text;
				if (document.getElementById("png").checked) imageType = "image/png";
				chrome.tabs.executeScript(tabId,{
					code: 'var img = new Image(); img.src = document.querySelector("img").src;'
						+' var canvas = document.createElement("canvas"); img.onload = () => {'
						+' var ctx = canvas.getContext("2d"); '
						+' if (90>='+ rotate +' &&'+ rotate +' >= 0) {canvas.height = img.width * Math.sin('+ rotate +'/180*Math.PI) + img.height * Math.cos('+ rotate +'/180*Math.PI); canvas.width = img.width * Math.cos('+ rotate +'/180*Math.PI) + img.height * Math.sin('+ rotate +'/180*Math.PI);};'
						+' if(-90<='+ rotate +' &&'+ rotate +' < 0) {canvas.height = img.width * Math.sin('+ -rotate +'/180*Math.PI) + img.height * Math.cos('+ -rotate +'/180*Math.PI); canvas.width = img.width * Math.cos('+ -rotate +'/180*Math.PI) + img.height * Math.sin('+ -rotate +'/180*Math.PI);};'
						+' if('+rotate+' > 90) {canvas.width = img.height * Math.sin('+ rotate +'/180*Math.PI) - img.width * Math.cos('+ rotate +'/180*Math.PI); canvas.height = img.width * Math.sin('+ rotate +'/180*Math.PI) - img.height * Math.cos('+ rotate +'/180*Math.PI);};'
						+' if('+rotate+' < -90) {canvas.height = img.width * Math.sin('+ -rotate +'/180*Math.PI) - img.height * Math.cos('+ -rotate +'/180*Math.PI); canvas.width = -img.width * Math.cos('+ -rotate +'/180*Math.PI) + img.height * Math.sin('+ -rotate +'/180*Math.PI);};'
						+' ctx.translate(canvas.width / 2,canvas.height / 2);'
						+' ctx.rotate('+ rotate +'/180*Math.PI);'
						+' if('+flipX+' || '+ flipY +') {ctx.setTransform('+flipX+' ? -1 : 1,0,0,'+flipY+' ? -1: 1,canvas.width/2,canvas.height/2);'
						+' if(!('+flipX+' && '+ flipY +')) ctx.rotate('+ -rotate +'/180*Math.PI);'
						+' if('+flipX+' && '+ flipY +')  ctx.rotate('+ rotate +'/180*Math.PI);};'
						+' ctx.drawImage(img, -img.width / 2, -img.height / 2);'
						+' var a = document.createElement("a"); a.href = canvas.toDataURL("'+imageType+'"); var url = window.location.pathname; var filename = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));a.download = filename; document.body.appendChild(a); a.click();/*document.body.appendChild(canvas);*/ }' 
				});
			})
		});	
	});
}


