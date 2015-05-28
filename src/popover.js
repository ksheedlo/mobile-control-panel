'use strict';

var qsa = require('./qsa'),
  allPopovers = [];

function isHidden(el) {
  return el.style.display === 'none';
}

function hide(el) {
  el.style.display = 'none';
  el.style.visibility = 'hidden';
}

function show(el) {
  el.style.display = '';
  el.style.visibility = 'visible';
}

function toggleHiddenState(el) {
  if (isHidden(el)) {
    show(el);
  } else {
    hide(el);
  }
}

qsa('.js__popover-toggle').forEach(function (el) {
  var popover = document.getElementById(el.getAttribute('data-popover-id'));

  // WOW
  popover.style.display = 'none';
  popover.style.visibility = 'hidden';

  allPopovers.push(popover);

  el.addEventListener('click', function () {
    allPopovers.forEach(function (pv) {
      if (pv !== popover) {
        hide(pv);
      }
    });

    toggleHiddenState(popover);
  });
});
