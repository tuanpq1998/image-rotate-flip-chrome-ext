var rotateImage = (deg) => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		var tabId = tabs[0].id;
		chrome.tabs.executeScript(tabId,{code: 'document.querySelector("img").style.transform = "rotate(' + deg +'deg)"' });
		document.getElementById("slider-input").value = deg;
		document.getElementById("manual-input").value = deg;
		var obj = {};
		obj['image-rotate-'+tabId] = deg;
		chrome.storage.local.set(obj, function() {
			console.log('Settings saved', obj);
		});
	});	
};

var flipImage = (way, isCheck) => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		var tabId = tabs[0].id;
		var script = "document.querySelector(\"img\").style.transform";
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
			console.log('Settings saved', obj);
		});
	});	
}

window.addEventListener('DOMContentLoaded', () => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		var tabId = tabs[0].id, keyRotate = 'image-rotate-' + tabId, 
			keyScaleX = "image-scaleX-" + tabId, 
			keyScaleY = "image-scaleY-" + tabId;
		chrome.storage.local.get([keyRotate, keyScaleX, keyScaleY], function(item) {
			console.log(item);
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


