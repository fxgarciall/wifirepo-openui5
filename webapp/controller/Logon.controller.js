sap.ui.define([
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/ui/core/mvc/Controller",
    "WiFiRepo/model/formatter",
    "WiFiRepo/constants/constants",
    "sap/ui/model/json/JSONModel",
], function(Button, Dialog, Text, Controller, formatter, constants, JSONModel) {
    "use strict";

    return Controller.extend("WiFiRepo.controller.Logon", {

      onLogin: function(){

        var user = this.getView().byId("user").getValue();
        var pass = this.getView().byId("pass").getValue();
        sap.m.MessageToast.show("Username: " + user + " Password: " + pass);

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("list");


      }

    });

});
