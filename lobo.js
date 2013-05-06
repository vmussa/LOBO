if (typeof window == 'undefined' || window === null) {
  require('prelude-ls').installPrelude(global);
} else {
  prelude.installPrelude(window);
}
(function(){
  var viclib, boxes, processing, THREE, v3;
  viclib = require('viclib').install();
  boxes = require('boxes');
  processing = require('processing');
  THREE = require('three');
  v3 = require('victhree').v3;
  $("body").append(div("test"));
}).call(this);
