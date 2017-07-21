sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
], function (Controller,JSONModel,ResourceModel) {
    "use strict";

    return Controller.extend("WiFiRepo.controller.WiFiList", {

        onShowHello: function () {
            // show a native JavaScript alert
            alert("Hello World");
        },

        onPress: function (oEvent) {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oItem = oEvent.getSource();
            var oCtx = oItem.getBindingContext();

            console.log(oCtx);
            console.log(this.getView().getModel().getProperty(oCtx.sPath));
            var selectedWiFi = this.getView().getModel().getProperty(oCtx.sPath);
            var oModel = new JSONModel(selectedWiFi);
            //Set selectedWiFi as Global for the next Screen..
            sap.ui.getCore().setModel(oModel, "globalSelectedWiFi");

            oRouter.navTo("detail", {wifiPath: oItem.getBindingContext().getPath().substr(1)});
            //,selectedWiFi);
            /*{
                id: selectedWiFi._id,
                ssid: selectedWiFi.ssid,
                summary: selectedWiFi.summary,
                password: selectedWiFi.password,
                likes: selectedWiFi.likes,
                unlikes: selectedWiFi.unlikes,
                lat: selectedWiFi.lat,
                lon: selectedWiFi.lon
            });*/
        }

    });
});
