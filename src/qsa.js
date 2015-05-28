'use strict';

module.exports = function (selector) {
  var elementsArray,
    selection;

  selection = document.querySelectorAll(selector);
  elementsArray = new Array(selection.length);
  for (var i = 0; i < selection.length; i++) {
    elementsArray[i] = selection[i];
  }

  return elementsArray;
};
