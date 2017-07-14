sap.ui.define([
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"WiFiRepo/model/formatter",
	"WiFiRepo/constants/constants"
], function(Button, Dialog, Text, Controller, MessageBox, formatter, constants) {
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
        _onRouteMatched: function(oEvent) {
        	var dummy = this.getView().getModel("data");
        	var that = this;
        	
			//Bloqueamos la vista mientras busco las WiFis
			this.getView().byId("searchWiFi").setBusy(true);

			console.log(constants.servicePreffix() + "/wifi/");

        	//Llamada ajax al servicio para obtener la configuracion 
			$.ajax({
				async: true,
		       	url: constants.servicePreffix() + "/wifi/",
		       	method: "GET",
	  			headers: {
	    			authorization: "Basic YW5kcm9pZDphbmRyb2lkX011czFDQjB4"
	  			},
				success: function(result) {
		    	
				var length = result.results.length;
				
				if(length===0){
					console.log("no user config found");
					//that._noConfigFound();
				}else{
					console.log("WiFiFound");
					console.log(result);
					that.getView().byId("searchWiFi").setBusy(false);
					//that._configFound();
				} 
				
		       },
		       error: function(error) {
									   
					console.log("Error, no user config found");
					console.log(error);
					that.getView().byId("searchWiFi").setBusy(false);
					//that._noConfigFound();
		       }
			});
        	
        },
        handlePress: function(oEvent) {
        	var router = sap.ui.core.UIComponent.getRouterFor(this);
        	var SHEDID = oEvent.getSource().getBindingContext("data").getObject().SHEDID;
            var oModel = this.getView().getModel("data");
            var that = this;
            var HOSTINGORDERID = 0;
            
            //Colocamos el galpón en el primer nivel:
            oModel.setProperty("/SHED/", oEvent.getSource().getBindingContext("data").getObject());
            
            //Bloqueamos la vista para que el usuario no trollee mientras los request al oData están ocurriendo:
			//this.getView().byId("tilesView").setBusy(true);

			$.ajax({async: true,
				url: constants.servicePreffix() + "/operationBroilersLot.xsjs?shedID=" + SHEDID + "&alojar=1",
				method: "GET",
				success: function(result) {
					if(result.beanError.statuscode === 200) {
						/*if(result.results[0].hostingPlan[0].hostingOrder[0].hostingDetail.length === undefined) {
							console.log("Este galpón no va pal baile.");
							sap.m.MessageBox.error(that.getOwnerComponent().getModel("i18n").getResourceBundle().getText("noHostingDetailsAvailable"), {
								actions: [sap.m.MessageBox.Action.OK],
								title: "Error",
								onClose: null,
								styleClass: ""
							});
						} else { */
							HOSTINGORDERID = parseInt("1"); /*parseInt(result.results[0].hostingPlan[0].hostingOrder[0].HOSTINGORDERID, 10);*/
							oModel.setProperty("/HOSTINGORDERID/", HOSTINGORDERID);
							oModel.setProperty("/BROILERSLOT/", result.results[0]);
							oModel.setProperty("/SHEDID/", parseInt(SHEDID, 10));
							
							//Desbloqueamos la vista para que el usuario no trollee mientras los request al oData están ocurriendo:
							that.getView().byId("tilesView").setBusy(false);
		            		
		            		router.navTo("recepcion", {SHEDID: SHEDID, ORDERID: HOSTINGORDERID}, true);
						//}
					} else {
						//Mensaje de error:
						console.log(result.beanError.SERVICE + " - " + result.beanError.METHOD + " - " + result.beanError.MSGERROR);
						sap.m.MessageToast.show(result.beanError.SERVICE + " - " + result.beanError.METHOD + " - " + result.beanError.MSGERROR, {
							duration: 5500,
							width: "70%"
						});
					}
				},
				error: function(error) {
					console.log(error);
					router.getTargets().display("errorOdata");
				}
			});
            
            /*oModel.read("/OSSHED", {
            	async: false,
            	filters:[
            		new sap.ui.model.Filter("SHEDID", sap.ui.model.FilterOperator.EQ, SHEDID)
            	],
            	urlParameters: {
					$expand: "TO_TXBROILERSLOT/TO_TXHOSTINGPLAN/TO_TXHOSTINGORDER"
				},
            	success: function(object){
            		var HOSTINGORDERID = object.results[0].TO_TXBROILERSLOT.TO_TXHOSTINGPLAN.TO_TXHOSTINGORDER.HOSTINGORDERID;
            		
            		
            	},
            	error: function(error){
            		//Bloqueamos la vista para que el usuario no trollee mientras los request al oData están ocurriendo:
					that.getView().byId("tilesView").setBusy(false);
					
            		router.getTargets().display("errorOdata");
            	}
            });*/
        },
        
        _noConfigFound: function(){
        	clientID = "2";
			partnerID = "17";
			farmID = "1";
			centerID = "2";
			this._configFound();
        },
        
        _configFound: function(){
        	var message = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("NoShedForHousing");
        	var router = sap.ui.core.UIComponent.getRouterFor(this);
        	var oModel = this.getView().getModel("data");
        	
        	console.log(clientID);
        	console.log(partnerID);
        	console.log(farmID);
        	console.log(centerID);
        	
        	//Llamada ajax al servicio para obtener los galpones adecuados:
			$.ajax({async: true,
		       //url: constants.servicePreffix() + "/operationShed.xsjs?clientID=1&partnerID=1&farmID=1&centerID=2&status=Disponible+para+alojamiento&broilerslot=1",
		       url: constants.servicePreffix() + "/operationShed.xsjs?clientID=" + clientID + "&partnerID=" + partnerID + "&farmID=" + farmID + "&centerID=" + centerID + "&status=Disponible+para+alojamiento&broilerslot=1",
		       method: "GET",
		       success: function(result) {
		       	 var length = result.results.length;
				 oModel.setProperty("/galpones/", result.results);
				 console.log(oModel);
				 console.log(length);
				
				if(length===0){
					var dialog = new Dialog({
						title: "",
						type: "Message",
						content: new Text({
							text: message
						}),
						beginButton: new Button({
							text: "OK",
							press: function () {
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
