define([
    "dojo/_base/declare",
    "epi/_Module",
    "epi-cms/contentediting/ContentDetails",
    "epi-cms/contentediting/viewmodel/ContentDetailsViewModel",
    "dojo/text!templates/ContentDetailsWithGuid.html"
  ], function (declare, _Module, ContentDetails, ContentDetailsViewModel, template) {
  
    return declare([_Module], {
      initialize: function () {
        this.inherited(arguments);
  
  
        //Implement extended functionality
  
        Object.assign(ContentDetails.prototype, {
          templateString: template,
          _setContentGuidAttr: { node: "guidNode", type: "innerHTML" },
          modelBindingMap: {
            contentTypeName: ["contentTypeName"],
            contentId: ["contentId"],
            contentGuid: ["contentGuid"],
            existingLanguages: ["existingLanguages"],
            visibleToEveryOne: ["visibleTo"]
          }
        })
  
        var original = ContentDetailsViewModel.prototype.onDataModelChange; //Store original functionality in variable
        Object.assign(ContentDetailsViewModel.prototype, {
          contentGuid: null,
          onDataModelChange: function () {
            this.set("contentGuid", this.dataModel.contentData.contentGuid);
            return original.apply(this, arguments); 
          }
        })
  
        ContentDetailsViewModel.prototype.onDataModelChange.nom = "onDataModelChange";
        }
      })
  });
  