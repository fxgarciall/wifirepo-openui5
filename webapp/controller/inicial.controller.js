sap.ui.define([
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageStrip",
    "WiFiRepo/model/formatter",
    "WiFiRepo/constants/constants",
    "openui5/googlemaps/MapUtils",
    "sap/ui/model/json/JSONModel",
], function(Button, Dialog, Text, Controller, MessageBox, MessageStrip, formatter, constants, MapUtils, JSONModel) {
    "use strict";

    return Controller.extend("WiFiRepo.controller.inicial", {

        formatter: formatter,

        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("list").attachMatched(this._onRouteMatched, this);

        },


				_getLocationCallback: function(oPos){

					var that = this;
					console.log(oPos);
					console.log(arguments);

				},

				_updateLocation: function(sLocation){

					console.log(sLocation);

				},

        _onRouteMatched: function(oEvent) {

						var dummy = this.getView().getModel("data");
            var that = this;
						var oRouter = sap.ui.core.UIComponent.getRouterFor(this);


            var getLocationCallback = function(oPos) {
							console.log(oPos);
							console.log(this);
							console.log(that);
							// testing position for an Empty List
							// Lat: 49.1732609, Lon: -124.0072314
							//oPos.lat = 49.1732609;
							//oPos.lng = -124.0072314;

							//Set Global Lat, lon
							var oGlobalLatLon = new JSONModel(oPos);
							sap.ui.getCore().setModel(oGlobalLatLon, "globalLatLon");

							if (oPos.lat!==undefined) {

								that.getView().byId("searchWiFi").setBusy(true);
								console.log(oPos.lng);
								var myPos = {
									lon: oPos.lng.toFixed(7).toString(),
									lat: oPos.lat.toFixed(7).toString()
								};
								//Llamada ajax al servicio para obtener las WiFi Cercanas
								$.ajax({
										async: true,
										url: constants.servicePreffix() + "/wifis",
										method: "PUT",
										headers: {
												authorization: "Basic YW5kcm9pZDphbmRyb2lkX011czFDQjB4"
										},
										data: myPos,
										success: function(result) {
												var length = result.length;
												that.getView().byId("searchWiFi").setBusy(false);
												if (length === 0) {
													  //TODO: Call NoWiFiFound View
														console.log("No WiFi Found");
														//oRouter.navTo("notFound");
                            var oMsgStrip = sap.ui.getCore().byId("msgStrip");
                            if(oMsgStrip){
                              oMsgStrip.destroy();
                            }

                            oMsgStrip = new sap.m.MessageStrip(
                              "msgStrip",
                              {
                                text: "{i18n>NoWiFiFound.text}",
                                showCloseButton: true,
                                showIcon: true,
                                type: "Information"
                              }
                            );
                            var oStripContent = that.getView().byId("oStripContent");
                            oStripContent.addContent(oMsgStrip);
														//that._noConfigFound();
												} else {
														console.log("WiFi Found");
														console.log(result);
                            var oMsgStrip = sap.ui.getCore().byId("msgStrip");
                            if(oMsgStrip){
                              oMsgStrip.destroy();
                            }
                            var oWiFiList = new JSONModel(result);
														//Set This Model to the View
														//that.getView().setModel(oWiFiList, "globalWiFiList");
														that.getView().setModel(oWiFiList);
														//Set WiFiList as Global
														sap.ui.getCore().setModel(oWiFiList, "globalWiFiList");

												}
										},
										error: function(error) {
												//TODO: Call NoWiFiFound View
												console.log("Error, no Wifi Found");
												console.log(error);
												that.getView().byId("searchWiFi").setBusy(false);
												//that._noConfigFound();
										}
								});

							}

						};

            //Bloqueamos la vista mientras busco las WiFis
            this.getView().byId("searchWiFi").setBusy(true);

            //Get WiFiList from Global and set Model to this View
            var oGlobalWiFiList = sap.ui.getCore().getModel("globalWiFiList");
            if (oGlobalWiFiList !== undefined) {

                this.getView().setModel(oGlobalWiFiList);
                this.getView().byId("searchWiFi").setBusy(false);
                return;

            }

						MapUtils.currentPosition()
							.then(getLocationCallback)
							.then(MapUtils.geocodePosition)
							.done(this._updateLocation);


						/*
            //Ajax Call to get all WiFi on Server
            $.ajax({
                async: true,
                url: constants.servicePreffix() + "/wifi/",
                method: "GET",
                headers: {
                    authorization: "Basic YW5kcm9pZDphbmRyb2lkX011czFDQjB4"
                },
                success: function(result) {
										that.getView().byId("searchWiFi").setBusy(false);
										var length = result.length;
                    if (length === 0) {
                        console.log("No WiFi Found");
                        //that._noConfigFound();
                    } else {
                        console.log("WiFi Found");
                        console.log(result);
                        var oWiFiList = new JSONModel(result);
                        //Set This Model to the View
                        //that.getView().setModel(oWiFiList, "globalWiFiList");
                        that.getView().setModel(oWiFiList);
                        //Set WiFiList as Global
                        sap.ui.getCore().setModel(oWiFiList, "globalWiFiList");

                    }
                },
                error: function(error) {
                    console.log("Error, no user config found");
                    console.log(error);
                    that.getView().byId("searchWiFi").setBusy(false);
                    //that._noConfigFound();
                }
            });
						*/
        },

				handleNewPress: function(){
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("new");
				},

        _noConfigFound: function() {

						//this._configFound();

        },

        _configFound: function() {

						//var router = sap.ui.core.UIComponent.getRouterFor(this);
            //var oModel = this.getView().getModel("data");

        }

    });

});
