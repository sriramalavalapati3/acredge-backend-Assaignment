import { propertyModel } from "../../../models";
import { property } from "../../../models/property-model";
import { updatePropertyParams } from "../types";

export default class propertiesWriter {
   static async createProperty(propertyData: property){
    const newProperty = new propertyModel(propertyData);
    await newProperty.save();
    return newProperty;
   }

   static async deleteProperty(id: string){
     return await propertyModel.deleteOne({_id:id})
   }

   static async updateProperty(params: updatePropertyParams ){
      const { id, ...updates } = params;

    
    const updated = await propertyModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true } 
    );

    return updated;
   }
}