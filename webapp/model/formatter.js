sap.ui.define([], function() {
 "use strict";
 
	return {
		  datetime: function(datetime){
		   var auxDate = new Date(datetime);
		   
		   //console.log(auxDate.toLocaleString("latn","gregory",{timeZone: "America/Caracas", formatMatcher: "basic"}));
		   
		   return auxDate.toLocaleString("es-VE", {timeZone: "America/Caracas", hour12: true});
		   //return datetime;
		  }
	};
});
