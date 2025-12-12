sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/VBox",
    "sap/m/HBox"
], function (Controller, MessageToast, JSONModel, Label, Input, VBox, HBox) {
    "use strict";

    return Controller.extend("project1.controller.View2", {

        onInit: function () {

            // ==========================================
            // MODEL INITIALIZATION
            // ==========================================
            const oData = {
                runnerId: "",
                campaignNo: "",
                repairStatus: "",
                houseName: "",
                sgpSensors: [],
                mudgunSensors: [],
                date: "",
                time: "",
                shift: ""
            };

            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "formData");

            // ==========================================
            // LIVE CLOCK
            // ==========================================
            var clock = this.byId("liveClock");
            setInterval(() => {
                var now = new Date();
                clock.setText(now.toLocaleTimeString());
            }, 1000);
        },

        // ==========================================
        // REPAIR STATUS DROPDOWN CHANGE
        // ==========================================
        onRepairStatusChange: function (oEvent) {
            const sKey = oEvent.getSource().getSelectedKey();
            MessageToast.show("Repair Status selected: " + sKey);
        },

        // ==========================================
        // SAVE BUTTON
        // ==========================================
        onSave: function () {
            const oModel = this.getView().getModel("formData");
            console.log("Saving Data:", oModel.getData());
            MessageToast.show("Temperature Data Saved!");
        },

        // ==========================================
        // SGP DYNAMIC FIELD GENERATION
        // ==========================================
        onGenerateSGPFields: function (oEvent) {
            let count = parseInt(oEvent.getParameter("value"), 10);
            let container = this.byId("sgpContainer");
            const oModel = this.getView().getModel("formData");

            // Reset UI + Model
            container.removeAllItems();
            oModel.setProperty("/sgpSensors", []);

            if (!count || count <= 0) return;

            for (let i = 0; i < count; i++) {
                container.addItem(this._createDynamicFieldSet("sgpSensors", i));
            }
        },

        // ==========================================
        // MUDGUN DYNAMIC FIELD GENERATION
        // ==========================================
        onGenerateMudgunFields: function (oEvent) {
            let count = parseInt(oEvent.getParameter("value"), 10);
            let container = this.byId("mudgunContainer");
            const oModel = this.getView().getModel("formData");

            // Reset UI + Model
            container.removeAllItems();
            oModel.setProperty("/mudgunSensors", []);

            if (!count || count <= 0) return;

            for (let i = 0; i < count; i++) {
                container.addItem(this._createDynamicFieldSet("mudgunSensors", i));
            }
        },

        // ==========================================
        // FIELDSET (CHAR10 + INT in Side-by-Side HBox)
        // ==========================================
        _createDynamicFieldSet: function (modelPath, index) {
            const oModel = this.getView().getModel("formData");

            // Add empty object in model
            oModel.getProperty("/" + modelPath).push({
                char10: "",
                intValue: ""
            });
            oModel.refresh();

            return new HBox({
                width: "100%",
                justifyContent: "SpaceBetween",
                items: [

                    // LEFT: CHAR10
                    new VBox({
                        width: "48%",
                        items: [
                            new Label({ text: "CHAR10 - " + (index + 1) }),
                            new Input({
                                placeholder: "CHAR10",
                                liveChange: (oEvent) => {
                                    let value = oEvent.getParameter("value");
                                    oModel.setProperty(`/${modelPath}/${index}/char10`, value);
                                }
                            })
                        ]
                    }),

                    // RIGHT: INT
                    new VBox({
                        width: "48%",
                        items: [
                            new Label({ text: "INT - " + (index + 1) }),
                            new Input({
                                type: "Number",
                                placeholder: "INT",
                                liveChange: (oEvent) => {
                                    let value = oEvent.getParameter("value");
                                    oModel.setProperty(`/${modelPath}/${index}/intValue`, value);
                                }
                            })
                        ]
                    })

                ],
                class: "sapUiSmallMarginBottom"
            });
        },

        // (Optional) ADD ROW MANUALLY
        onAddSGPSensor: function () {
            const oModel = this.getView().getModel("formData");
            oModel.getProperty("/sgpSensors").push({ char10: "", intValue: "" });
            oModel.refresh();
        },

        onAddMudgunSensor: function () {
            const oModel = this.getView().getModel("formData");
            oModel.getProperty("/mudgunSensors").push({ char10: "", intValue: "" });
            oModel.refresh();
        }

    });
});
