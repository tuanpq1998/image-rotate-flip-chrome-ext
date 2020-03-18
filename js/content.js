
/*window.addEventListener("load", function() {
    chrome.extension.sendMessage({
        type: "dom-loaded", 
        data: {
            myProperty: document.body.innerHTML
        }
    });
}, true);*/

chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction',
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if ((msg.from === 'popup') && (msg.subject === 'ImageURL check')) {
  	var type = document.contentType;
  	var imageInfo = {text : type, abc: false};
    response(imageInfo);
 
  }
});




