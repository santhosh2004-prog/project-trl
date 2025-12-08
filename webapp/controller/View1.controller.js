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
      this._initCampaignNo();
      this._loadDropdowns();
    },

    _initModel: function () {
      const data = {
        customer: "",
        location: "",
        runnerId: "",
        campaignNo: "",
        repairStatus: "",
        lineCount: 0,
        lines: []
      };
      this.getView().setModel(new JSONModel(data));
    },

    _initCampaignNo: function () {
      const no = "CMP-" + Date.now();
      this.byId("campaign").setValue(no);
      this.getView().getModel().setProperty("/campaignNo", no);
    },

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

      this.byId("customer").setModel(customerModel)
        .bindItems("/items", new sap.ui.core.ListItem({ key: "{key}", text: "{text}" }));

      this.byId("location").setModel(locationModel)
        .bindItems("/items", new sap.ui.core.ListItem({ key: "{key}", text: "{text}" }));
    },

    // =================================================
    // CREATE PANELS
    // =================================================
    onLineCountChange: function (oEvent) {

      let count = parseInt(oEvent.getParameter("value"), 10);
      const container = this.byId("linesContainer");
      const model = this.getView().getModel();

      container.destroyItems();

      if (isNaN(count) || count <= 0) {
        model.setProperty("/lines", []);
        return;
      }

      const aLines = [];

      for (let i = 0; i < count; i++) {

        const index = i + 1;

        const panel = new sap.m.Panel({
          headerText: "House / Production Line - " + index,
          expandable: true,
          expanded: true
        }).addStyleClass("whiteCard");

        // ================= LINE NAME =================
       const lineName = new sap.m.Input({
  placeholder: "Line Name (max 10)",
  maxLength: 10,
  width: "50%",
  liveChange: function (oEvent) {

    let value = oEvent.getSource().getValue();

    // ✅ Remove everything except letters and spaces
    value = value.replace(/[^a-zA-Z\s]/g, "");

    oEvent.getSource().setValue(value);
    aLines[i].name = value;
  }
});


        // ================= SPG =================
        const spgCount = new sap.m.Input({
          type: "Number",
          width: "120px",
          placeholder: "No of SPG",
          change: this._handleSpgChange.bind(this, i)
        });

        const spgBox = new sap.m.HBox({ wrap: "Wrap" });

        // ================= MUDGUN =================
        const mudgunCount = new sap.m.Input({
          type: "Number",
          width: "120px",
          placeholder: "No of Mudgun",
          change: this._handleMudgunChange.bind(this, i)
        });

        const mudgunBox = new sap.m.HBox({ wrap: "Wrap" });

        // ================= LAYOUT =================

        const layout = new sap.ui.layout.VerticalLayout({ width: "100%" });

        // Row 1
        layout.addContent(new sap.m.VBox({
          items: [
            new sap.m.Label({ text: "Line Name" }).addStyleClass("boldLabel"),
            lineName
          ]
        }));

        // Row 2 → SPG COUNT + SPG FIELDS IN SAME ROW
        layout.addContent(new sap.m.HBox({
          width: "100%",
          alignItems: "Center",
          items: [
            new sap.m.VBox({
              width: "200px",
              items: [new sap.m.Label({ text: "No of SPG Sensors" }), spgCount]
            }),
            spgBox
          ]
        }));

        // Row 3 → MUDGUN COUNT + MUDGUN FIELDS IN SAME ROW
        layout.addContent(new sap.m.HBox({
          width: "100%",
          alignItems: "Center",
          items: [
            new sap.m.VBox({
              width: "200px",
              items: [new sap.m.Label({ text: "No of Mudgun Sensors" }), mudgunCount]
            }),
            mudgunBox
          ]
        }));

        panel.addContent(layout);
        container.addItem(panel);

        aLines.push({
          name: "",
          spgCount: 0,
          spgSensors: [],
          mudgunCount: 0,
          mudgunSensors: [],
          spgBox: spgBox,
          mudgunBox: mudgunBox
        });
      }

      model.setProperty("/lines", aLines);
    },

    // =================================================
    // SPG
    // =================================================
    _handleSpgChange: function (lineIndex, oEvent) {

      const count = parseInt(oEvent.getParameter("value"), 10);
      const model = this.getView().getModel();
      const line = model.getProperty("/lines")[lineIndex];
      const box = line.spgBox;

      box.destroyItems();

      const sensors = [];
      for (let i = 0; i < count; i++) {
        const input = new sap.m.Input({
          width: "70px",
          placeholder: "SPG " + (i + 1),
          change: e => {
            sensors[i] = e.getSource().getValue();
            line.spgSensors = sensors;
            model.refresh();
          }
        });
        sensors.push("");
        box.addItem(input);
      }

      line.spgCount = count;
    },

    // =================================================
    // MUDGUN
    // =================================================
    _handleMudgunChange: function (lineIndex, oEvent) {

      const count = parseInt(oEvent.getParameter("value"), 10);
      const model = this.getView().getModel();
      const line = model.getProperty("/lines")[lineIndex];
      const box = line.mudgunBox;

      box.destroyItems();

      const sensors = [];
      for (let i = 0; i < count; i++) {
        const input = new sap.m.Input({
          width: "70px",
          placeholder: "MG " + (i + 1),
          change: e => {
            sensors[i] = e.getSource().getValue();
            line.mudgunSensors = sensors;
            model.refresh();
          }
        });
        sensors.push("");
        box.addItem(input);
      }

      line.mudgunCount = count;
    },

    // =================================================
    // SAVE
    // =================================================
    onSave: function () {
      console.log(this.getView().getModel().getData());
      MessageToast.show("Saved Successfully");
    },

    // =================================================
    // RESET
    // =================================================
    onReset: function () {
      MessageBox.confirm("Reset all fields?", {
        onClose: a => {
          if (a === "OK") {
            this._initModel();
            this._initCampaignNo();
            this.byId("linesContainer").destroyItems();
            MessageToast.show("Reset Completed");
          }
        }
      });
    },

    // =================================================
    // REPAIR STATUS
    // =================================================
    onRepairStatusChange: function (oEvent) {
      if (oEvent.getSource().getSelectedKey() === "major") {
        const no = "CMP-" + Math.floor(Math.random() * 1000000);
        this.byId("campaign").setValue(no);
        this.getView().getModel().setProperty("/campaignNo", no);
        MessageToast.show("Campaign Re-generated");
      }
    }

  });
});
