/*chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "dom-loaded":
            alert(request.data.myProperty);
        break;
    }
   
    return true;
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab.
    chrome.pageAction.show(sender.tab.id);
  }
   return true; 
});*/

chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
	chrome.storage.local.remove('image-rotate-'+tabId);
	chrome.storage.local.remove('image-scaleX-'+tabId);
	chrome.storage.local.remove('image-scaleY-'+tabId);
});