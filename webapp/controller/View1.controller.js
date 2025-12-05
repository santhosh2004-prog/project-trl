sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("project1.controller.View1", {

    onInit: function () {
      this._initModel();
      this._initCampaignNumber();
      this._loadDropdowns();
    },


    //  Set default JSON Model
    _initModel: function () {

      const data = {
        customer: "",
        location: "",
        runnerId: "",
        campaignNo: "",
        repairStatus: "",
        minorRepairStatus: "",
        productionLineCount: 0,
        line1: {
          spgCount: 0,
          spgSensors: []
        }
      };

      const oModel = new JSONModel(data);
      this.getView().setModel(oModel);
    },


    //  Auto Generate Campaign Number
    _initCampaignNumber: function () {

      const ts = Date.now();
      const campaign = "CMP-" + ts;

      this.getView().getModel().setProperty("/campaignNo", campaign);
      this.getView().byId("campaign").setValue(campaign);
    },


    //  Dropdown Values
    _loadDropdowns: function () {

      const customerModel = new JSONModel({
        items: [
          { key: "C1", text: "TRL SMS" },
          { key: "C2", text: "Dolvi" },
          { key: "C3", text: "JSPL" }
        ]
      });

      const locationModel = new JSONModel({
        items: [
          { key: "L1", text: "Chennai" },
          { key: "L2", text: "Pune" },
          { key: "L3", text: "Bangalore" }
        ]
      });

      this.getView().byId("customer").setModel(customerModel);
      this.getView().byId("customer").bindItems("/items",
        new sap.ui.core.ListItem({ key: "{key}", text: "{text}" })
      );

      this.getView().byId("location").setModel(locationModel);
      this.getView().byId("location").bindItems("/items",
        new sap.ui.core.ListItem({ key: "{key}", text: "{text}" })
      );
    },


    //  DYNAMIC SPG FIELD GENERATION
    onSpgCountChange_Line1: function (oEvent) {

      let count = parseInt(oEvent.getSource().getValue(), 10);
      const spgBox = this.byId("spgBoxLine1");
      const model = this.getView().getModel();

      spgBox.removeAllItems();

      if (isNaN(count) || count <= 0) {
        return;
      }

      if (count > 3) {
        MessageBox.warning("Maximum 3 SPG Sensors allowed.");
        count = 3;
        oEvent.getSource().setValue(3);
      }

      const sensors = [];

      for (let i = 0; i < count; i++) {

        const id = "spg_" + i;

        const input = new sap.m.Input({
          width: "70px",
          placeholder: "SPG " + (i + 1),
          liveChange: function (e) {
            sensors[i] = e.getSource().getValue();
            model.setProperty("/line1/spgSensors", sensors);
          }
        });

        sensors.push("");
        spgBox.addItem(input);
      }

      model.setProperty("/line1/spgCount", count);
      model.setProperty("/line1/spgSensors", sensors);
    },


    //  SAVE BUTTON
    onSave: function () {

      const data = this.getView().getModel().getData();

      if (!data.customer || !data.location || !data.runnerId) {
        MessageBox.error("Please fill all mandatory fields");
        return;
      }

      console.log(" DATA TO SAVE", data);

      MessageToast.show("Data Saved Successfully ");
    },


    //  RESET BUTTON
    onReset: function () {

      MessageBox.confirm("Reset all fields?", {
        onClose: (oAction) => {
          if (oAction === "OK") {
            this._initModel();
            this._initCampaignNumber();
            this.byId("spgBoxLine1").removeAllItems();
            MessageToast.show("Form Reset");
          }
        }
      });
    }
,
onSpgCountChange_Line2: function (oEvent) {
    this._handleSpgChange(oEvent, "spgBoxLine2", "/line2");
},

onSpgCountChange_Line3: function (oEvent) {
    this._handleSpgChange(oEvent, "spgBoxLine3", "/line3");
},
onRepairStatusChange: function (oEvent) {

    const selectedKey = oEvent.getSource().getSelectedKey();

    if (selectedKey === "major") {

        // Generate new Campaign No
        const randomCampaign = "CMP-" + Math.floor(Math.random() * 1000000);

        this.getView().byId("campaign").setValue(randomCampaign);
        this.getView().getModel().setProperty("/campaignNo", randomCampaign);

        sap.m.MessageToast.show("New Campaign No generated for Major Repair ");
    }
}



  });
});
