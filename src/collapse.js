'use strict';

var qsa = require('./qsa');

qsa('.js__collapse-toggle').forEach(function (el) {
  el.addEventListener('click', function () {
    var myId = el.getAttribute('data-target'),
      myElement = document.getElementById(myId),
      collapsers,
      nCollapsers;

    if ($(myElement).hasClass('in')) {
      $(myElement).collapse('hide');
    } else {
      collapsers = $('.js__collapse').filter(function (i, el) {
        return el.id !== myId;
      })
      .filter('.in');
      nCollapsers = collapsers.length;

      if (nCollapsers === 0) {
        $(myElement).collapse('show');
      } else {
        collapsers.each(function (i, el) {
          $(el).collapse('hide');
          $(el).on('hidden.bs.collapse', function () {
            if (--nCollapsers === 0) {
              $(myElement).collapse('show');
            }
          });
        });
      }
    }
  });
});
