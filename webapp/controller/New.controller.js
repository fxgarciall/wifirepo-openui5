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

	return Controller.extend("WiFiRepo.controller.New", {

		onInit: function () {
			/*var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

			// Set the initial form to be the display one
			*/
			//URL Path
      //Get Global Lat lon
      var oGlobalLatLon = sap.ui.getCore().getModel("globalLatLon");
      console.log(oGlobalLatLon.getProperty("/lat"));
			//Create an Empty TV Show Model
      var oNewWiFi= new JSONModel();
      oNewWiFi.setProperty("/lat",oGlobalLatLon.getProperty("/lat"));
      oNewWiFi.setProperty("/lon",oGlobalLatLon.getProperty("/lng"));
      //Assign to the view
      var oView = this.getView();
      oView.setModel(oNewWiFi,"WiFi");

      //Show New Fragment
			this._showFormFragment("New");

		},

		handleCancelPress : function () {

			//Nav Back
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", true);
			}

		},

		handleSavePress : function () {

			var that = this;
			//Save the Data
			var oModel = this.getView().getModel("WiFi");
			jQuery.ajax({
				type: "POST",
				contentType : "application/json",
				url: constants.servicePreffix() + "/wifi",
        headers: {
            authorization: "Basic YW5kcm9pZDphbmRyb2lkX011czFDQjB4"
        },
        dataType : "json",
				async: true,
				data: JSON.stringify(oModel.getData()),
				success : function(data,textStatus, jqXHR) {
          console.log("success to Update");
          MessageToast.show("Successfully Saved",{duration: 2000});

          //Refresh Model. Get Global List
          var oGlobalWiFiList = sap.ui.getCore().getModel("globalWiFiList");
          //Get JSON Object
          var oGlobalWiFiListJSON = oGlobalWiFiList.getData();
          console.log(data);
          //Push New WiFi
          oGlobalWiFiListJSON.push(data);
          //Set New JSON To Global Model
          oGlobalWiFiList.setData(oGlobalWiFiListJSON);
          sap.ui.getCore().getModel(oGlobalWiFiList, "globalWiFiList");

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
            		MessageToast.show("Error Occurred, Try Again",{duration: 2000});
            		console.log(err);
            	}
			});

		},


		_onObjectMatched: function (oEvent) {

      var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
      var oNewWiFi = new JSONModel();

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

			oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "WiFiRepo.fragment." + sFragmentName);

			return this._formFragments[sFragmentName] = oFormFragment;
		},

		_showFormFragment : function (sFragmentName) {
			var oPage = this.getView().byId("page");

			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment(sFragmentName));

		}
	});
});
