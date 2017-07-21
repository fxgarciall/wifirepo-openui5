sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"WiFiRepo/constants/constants",
	"sap/m/MessageToast"
], function (jQuery, Fragment, Controller, ODataModel, JSONModel, History, constants, MessageToast) {
	"use strict";

	var globalDataModel;
	var modelPath;
	var oGlobalWiFi;

	return Controller.extend("WiFiRepo.controller.Detail", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

			// Set the initial form to be the display one
			this._showFormFragment("DisplayDetail");
		},

		handleEditPress : function () {

			//Clone the data
			globalDataModel = this.getView().getModel("WiFi");
			this._globalData = jQuery.extend({},this.getView().getModel("WiFi").getData());
			this._toggleButtonsAndView(true);

		},

		handleCancelPress : function () {

			//Restore the data
			var oModel = this.getView().getModel("WiFi");
			var oData = oModel.getData();
			oData = this._globalData;
			oModel.setData(oData);

			this._toggleButtonsAndView(false);

		},

		handleSavePress : function () {

			var that = this;
			console.log(oGlobalWiFi.getProperty("/_id"));
			console.log(oGlobalWiFi.getJSON());
			var ssid = oGlobalWiFi.getProperty("/_id");
			var oView = this.getView();
			var changeJSON = {
				summary: oGlobalWiFi.getProperty("/summary"),
				password: oGlobalWiFi.getProperty("/password")
			};
			console.log(changeJSON);


			//Call Service to Update WiFi
			$.ajax({
				async: true,
				url: constants.servicePreffix() + "/wifi/" + ssid,
				method: "PUT",
				headers: {
					authorization: "Basic YW5kcm9pZDphbmRyb2lkX011czFDQjB4"
				},
				data: changeJSON,
				success: function(result) {

					var updatedWiFi = new JSONModel(result);
					oView.setModel(updatedWiFi, "WiFi");
					MessageToast.show("Updated", {duration: 2000});
					that._toggleButtonsAndView(false);

				},
				error: function(error) {
					MessageToast.show("Error updating WiFi", {duration: 2000});
					that._toggleButtonsAndView(false);
				}
			});


/*
			//Save the data...
			//

			var that = this;
			var oModel = this.getView().getModel("TVShow");
			var oData = oModel.getData();

			jQuery.ajax({
				type: "PUT",
				contentType : "application/json",
				url : modelPath,
				dataType : "json",
				async: true,
				data: JSON.stringify(oData),
				success : function(data,textStatus, jqXHR) {
                	console.log("success to Update");
                	MessageToast.show("Successfully Updated",{duration: 2000});
                	that._toggleButtonsAndView(false);
            	},
            	error : function(err){
            		//Restore the data
					var oModel = that.getView().getModel("TVShow");
					var oData = oModel.getData();
					oData = that._globalData;
					oModel.setData(oData);
            		that._toggleButtonsAndView(false);

            		MessageToast.show("Error Occurred, Try Again",{duration: 2000});
            		console.log(err);
            	}
			});
*/
		},

		handleDeletePress: function(){
			//Delete From Model
			//var oModel = this.getView().getModel("TVShow");
			//oModel.loadData(modelPath,oModel.getData(),true,"DELETE");

			var that = this;
/*
			jQuery.ajax({
				type: "DELETE",
				contentType : "application/json",
				url : modelPath,
				dataType : "json",
				async: true,
				success : function(data,textStatus, jqXHR) {
                	console.log("success to delete");
                	MessageToast.show("Successfully Deleted",{duration: 2000});

                	//Refresh Model and go Back
					var oModelTVShows = that.getView().getModel();
					oModelTVShows.loadData('http://localhost:8888/proxy/api/tvshows');
					//Nav Back
					var oHistory = History.getInstance();
					var sPreviousHash = oHistory.getPreviousHash();

					if (sPreviousHash !== undefined) {
						window.history.go(-1);
					} else {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("overview", true);
					}

            	},
            	error : function(err){
            		console.log("Error");
            		console.log(err);
            	}
			});
*/

		},

		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", true);
			}
		},

		onLiked: function(oEvt){

			console.log(oGlobalWiFi.getProperty("/_id"));
			var ssid = oGlobalWiFi.getProperty("/_id");
			var oView = this.getView();

			//Call Service to Like WiFi
			$.ajax({
				async: true,
				url: constants.servicePreffix() + "/wifi/" + ssid + "/like",
				method: "PUT",
				headers: {
					authorization: "Basic YW5kcm9pZDphbmRyb2lkX011czFDQjB4"
				},
				success: function(result) {

					var newWiFi = new JSONModel(result);
					oView.setModel(newWiFi, "WiFi");
					MessageToast.show("Liked", {duration: 2000});

				},
				error: function(error) {
					MessageToast.show("Error liking WiFi", {duration: 2000});
				}
			});

		},

		onUnliked: function(oEvt){

			console.log(oGlobalWiFi.getProperty("/_id"));
			var ssid = oGlobalWiFi.getProperty("/_id");
			var oView = this.getView();

			//Call Service to Like WiFi
			$.ajax({
				async: true,
				url: constants.servicePreffix() + "/wifi/" + ssid + "/unlike",
				method: "PUT",
				headers: {
					authorization: "Basic YW5kcm9pZDphbmRyb2lkX011czFDQjB4"
				},
				success: function(result) {

					var newWiFi = new JSONModel(result);
					oView.setModel(newWiFi, "WiFi");
					MessageToast.show("Unliked", {duration: 2000});

				},
				error: function(error) {
					MessageToast.show("Error unliking WiFi", {duration: 2000});
				}
			});

		},

		_onObjectMatched: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			//Get selectedWiFi from Global and set Model to this View
			oGlobalWiFi = sap.ui.getCore().getModel("globalSelectedWiFi");
			console.log(oGlobalWiFi);
			oView.setModel(oGlobalWiFi,"WiFi");

			oView.bindElement({
				//path : "/(" + oArgs.id + ")",
				path: "/" + oEvent.getParameter("arguments").wifiPath,
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});

		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},

		_formFragments: {},

		_toggleButtonsAndView : function (bEdit) {
			var oView = this.getView();

			// Show the appropriate action buttons
			oView.byId("edit").setVisible(!bEdit);
			oView.byId("delete").setVisible(!bEdit);
			oView.byId("save").setVisible(bEdit);
			oView.byId("cancel").setVisible(bEdit);

			// Set the right form type
			this._showFormFragment(bEdit ? "ChangeDetail" : "DisplayDetail");
		},

		_getFormFragment: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
			}

			//oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "WiFiRepo.fragment." + sFragmentName);
			oFormFragment = sap.ui.xmlfragment("WiFiRepo.fragment." + sFragmentName, this );

			return this._formFragments[sFragmentName] = oFormFragment;
		},

		_showFormFragment : function (sFragmentName) {
			var oPage = this.getView().byId("page");

			//var oModel = this.getView().getModel("TVShow")

			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment(sFragmentName));
			//this.getView().setModel(oModel,"TVShow");

		}
	});
});
