import { property } from "../../../models/property-model";
import {
  deletePropertyFromElasticServer,
  indexProperty,
  searchProperties,
  updatePropertyInElasticServer,
} from "../elasticSearch";
import propertiesReader from "../internal/properties-reader";
import propertiesWriter from "../internal/properties-writer";
import {
  getAllPropertiesParams,
  PropertyBadRequestError,
  propertyDataSchema,
  PropertyNotFoundError,
  searchQueryParams,
  updatePropertyParams,
  updatePropertyParamsSchema,
} from "../types";

export default class propertiesService {
  static async addProperty(propertyData: property) {
    let res = propertyDataSchema.safeParse(propertyData);
    if (!res.success) {
      const errMessage = res.error.issues
        .map(
          (obj) =>
            `{ Key: ${obj.path.join(".")},  Error code: ${
              obj.code
            }, Error message: ${obj.message} }`
        )
        .join("; ");
      throw new PropertyBadRequestError(`Invalid request : ${errMessage}`);
    }

    const newProperty = await propertiesWriter.createProperty(propertyData);
    await indexProperty(newProperty);
    return newProperty;
  }

  static async allGetProperties(params: getAllPropertiesParams) {
    let properties = await propertiesReader.getProperties(params);
    return properties;
  }

  static async getPropertyById(id: string) {
    let property = await propertiesReader.getPropertyById(id);
    return property;
  }

  static async deletePropertyById(id: string) {
    let property = await this.getPropertyById(id);
    if (!property) {
      throw new PropertyNotFoundError("Property Not Found");
    }
    await deletePropertyFromElasticServer(id);
    return await propertiesWriter.deleteProperty(id);
  }

  static async updatePropertyById(params: updatePropertyParams) {
    let res = updatePropertyParamsSchema.safeParse(params);
    if (!res.success) {
      const errMessage = res.error.issues
        .map(
          (obj) =>
            `{ Key: ${obj.path.join(".")},  Error code: ${
              obj.code
            }, Error message: ${obj.message} }`
        )
        .join("; ");
      throw new PropertyBadRequestError(`Invalid request : ${errMessage}`);
    }

    let findProperty = await propertiesReader.getPropertyById(
      params.id as string
    );
    if (!findProperty) {
      throw new PropertyNotFoundError("Property Not Found");
    }

    const property = await propertiesWriter.updateProperty(params);

    const { _doc } = property as any;

    await updatePropertyInElasticServer(_doc);

    return property;
  }

  static async searchProperties(params: searchQueryParams){
    let properties = await searchProperties(params);
    return properties
  }
}
