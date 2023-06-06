window.addEventListener("load", function () {
  var shareButtons = document.querySelectorAll('div.share');

  for (var shareButton of shareButtons) {
    shareButton.addEventListener("click", function (event) {
      event.preventDefault();
      var shareUrl = event.target.getAttribute('url') || '';
      var shareTitle = event.target.getAttribute('title') || '';
      if (navigator.share) {
        navigator.share({
          url: shareUrl,
          title: shareTitle,
          text: shareTitle
        }).then(function () { ga('send', 'event', 'share', 'success'); },
          function (error) { ga('send', 'event', 'share', 'error', error); });
      } else {
        var windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=520,height=420';
        var twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl) + '&via=Paul_Kinlan';
        window.open(twitterUrl, 'intent', windowOptions);
      }
    });
  }
});