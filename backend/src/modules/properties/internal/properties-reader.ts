import { propertyModel } from "../../../models";
import { getAllPropertiesParams } from "../types";

export default class propertiesReader {
  static async getProperties(params: getAllPropertiesParams) {
    const limit = 20;
    let { pageNumber } = params;
    pageNumber = pageNumber ? pageNumber : 1;
    const skip = (pageNumber - 1) * limit;

    let filter: any = {};

  if (params.location) {
    filter["location.city"] = {
      $regex: new RegExp(`^${params.location.trim()}$`, "i"),
    };
  }

  const properties = await propertyModel.find(filter)
    .skip(skip)
    .limit(limit);

    const total = await propertyModel.countDocuments(filter);
    return {
        data: properties,
        meta: {
            total,
            pageNumber,
            totalPages: Math.ceil(total / limit),
        },
    };

  }

  static async getPropertyById(id: string){
    let property = await propertyModel.findOne({_id:id});
    return property;
  }
}
