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

        var that = this;

        that.getView().byId("logonForm").setBusy(true);

        var user = this.getView().byId("user").getValue();
        var pass = this.getView().byId("pass").getValue();
        //sap.m.MessageToast.show("Username: " + user + " Password: " + pass);
        //console.log(btoa(user + ":" + pass));
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        //Put Auth data to Global Model
        var authData = {
          "Auth": btoa(user + ":" + pass)
        };
        var authModel = new JSONModel(authData);
        sap.ui.getCore().setModel(authModel, "globalAuthData");

        //Check User/Password
        $.ajax({
            async: true,
            url: constants.servicePreffix() + "/CheckAvailability",
            method: "GET",
            headers: {
                authorization: "Basic " + authModel.getProperty("/Auth")
            },
            success: function(result) {
              console.log("success:");
              console.log(result);
              that.getView().byId("logonForm").setBusy(false);
              oRouter.navTo("list");

            },
            error: function(error) {
              that.getView().byId("logonForm").setBusy(false);
              console.log("error:");
              console.log(error);
              if(error.status===401){
                //Unauthorized
                sap.m.MessageToast.show("Wrong Username and Password");
              }else{
                //Other error
                sap.m.MessageToast.show("Unknown error, Please try again");
              }



            }
        });

      }

    });

});
