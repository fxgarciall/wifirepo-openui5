sap.ui.define([
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "WiFiRepo/model/formatter",
    "WiFiRepo/constants/constants",
    "openui5/googlemaps/MapUtils",
    "sap/ui/model/json/JSONModel",
], function(Button, Dialog, Text, Controller, MessageBox, formatter, constants, MapUtils, JSONModel) {
    "use strict";

    var clientID = "";
    var partnerID = "";
    var farmID = "";
    var centerID = "";


    return Controller.extend("WiFiRepo.controller.inicial", {

        formatter: formatter,

        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("appHome").attachMatched(this._onRouteMatched, this);
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

						var getLocationCallback = function(oPos) {
							console.log(oPos);
							console.log(this);
							console.log(that);

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
            //Llamada ajax al servicio para obtener las WiFi
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
            clientID = "2";
            partnerID = "17";
            farmID = "1";
            centerID = "2";
            this._configFound();
        },

        _configFound: function() {
            var message = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("NoShedForHousing");
            var router = sap.ui.core.UIComponent.getRouterFor(this);
            var oModel = this.getView().getModel("data");

            console.log(clientID);
            console.log(partnerID);
            console.log(farmID);
            console.log(centerID);

            //Llamada ajax al servicio para obtener los galpones adecuados:
            $.ajax({
                async: true,
                //url: constants.servicePreffix() + "/operationShed.xsjs?clientID=1&partnerID=1&farmID=1&centerID=2&status=Disponible+para+alojamiento&broilerslot=1",
                url: constants.servicePreffix() + "/operationShed.xsjs?clientID=" + clientID + "&partnerID=" + partnerID + "&farmID=" + farmID + "&centerID=" + centerID + "&status=Disponible+para+alojamiento&broilerslot=1",
                method: "GET",
                success: function(result) {
                    var length = result.results.length;
                    oModel.setProperty("/galpones/", result.results);
                    console.log(oModel);
                    console.log(length);

                    if (length === 0) {
                        var dialog = new Dialog({
                            title: "",
                            type: "Message",
                            content: new Text({
                                text: message
                            }),
                            beginButton: new Button({
                                text: "OK",
                                press: function() {
                                    dialog.close();
                                }
                            }),
                            afterClose: function() {
                                dialog.destroy();
                            }
                        });
                        dialog.open();
                    }

                },
                error: function(error) {
                    console.log(error);
                    router.getTargets().display("errorOdata");
                }
            });

        }

    });

});
