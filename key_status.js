//Taken directly from
//http://www.html5rocks.com/en/tutorials/canvas/notearsgame/

jQuery(function() {
  window.keydown = {};
  
  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }
  
  jQuery(document).bind("keydown", function(event) {
    keydown[keyName(event)] = true;
  });
  
  jQuery(document).bind("keyup", function(event) {
    keydown[keyName(event)] = false;
  });
});
