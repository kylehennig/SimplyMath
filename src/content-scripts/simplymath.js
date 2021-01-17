window.addEventListener('load', () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    sendResponse({ message: "Response!" });
  });
});
