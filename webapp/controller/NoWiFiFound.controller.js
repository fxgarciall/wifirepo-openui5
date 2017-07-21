sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("WiFiRepo.controller.NoWiFiFound", {

		 goBack: function(){
    		var oHistory, sPreviousHash;
    		var router = sap.ui.core.UIComponent.getRouterFor(this);

    		oHistory = sap.ui.core.routing.History.getInstance();
    		sPreviousHash = oHistory.getPreviousHash();

    		if (sPreviousHash !== undefined) {
    			window.history.go(-1);
    		} else {
    			router.navTo("appHome", {}, false /*no history*/);
    		}
   	    }

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf AF_AVI_EG_RecepcionPolloBebe.view.NotFound
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf AF_AVI_EG_RecepcionPolloBebe.view.NotFound
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf AF_AVI_EG_RecepcionPolloBebe.view.NotFound
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf AF_AVI_EG_RecepcionPolloBebe.view.NotFound
		 */
		//	onExit: function() {
		//
		//	}

	});

});
