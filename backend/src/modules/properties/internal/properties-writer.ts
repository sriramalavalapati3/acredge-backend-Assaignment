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

   static async updateProperty(params: updatePropertyParams) {
  const { id, _id, ...updates } = params;
  const propertyId = id || _id;
  
  if (!propertyId) {
    throw new Error('Property ID is required');
  }

  // First get the current property data
  const currentProperty = await propertyModel.findById(propertyId);
  if (!currentProperty) {
    throw new Error('Property not found');
  }

  const updatePayload: any = {};

  // Handle location updates - merge with existing location
  if (updates.location) {
    updatePayload.location = {
      ...currentProperty.location, // Merge with existing location object
      ...(updates.location.city && { city: updates.location.city }),
      ...(updates.location.locality && { locality: updates.location.locality }),
      ...(updates.location.sector && { sector: updates.location.sector }),
    };
  }

  // Handle other property fields
  if (updates.title) updatePayload.title = updates.title;
  if (updates.type) updatePayload.type = updates.type;
  if (updates.price) updatePayload.price = updates.price;
  if (updates.area) updatePayload.area = updates.area;
  if (updates.status) updatePayload.status = updates.status;
  if (updates.amenities) updatePayload.amenities = updates.amenities;

  const updated = await propertyModel.findByIdAndUpdate(
    propertyId,
    { $set: updatePayload },
    { new: true }
  );

  return updated;
}
}