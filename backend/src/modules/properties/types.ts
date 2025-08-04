import z from "zod";
import { ApplicationError } from "../Application/application-error-handlers";
import HttpStatusCodes from "../../utils/http";

export enum PropertyType {
  Residential = 'Residential',
  Commercial = 'Commercial',
  TwoBHK = '2BHK',
  ThreeBHK = '3BHK',
}

export enum PropertyStatus {
  ForSale = 'For Sale',
  ForRent = 'For Rent',
}

export const propertyDataSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),

  location: z.object({
    city: z.string().min(1, { message: 'City is required' }),
    locality: z.string().min(1, { message: 'Locality is required' }),
    sector: z.string().optional(),
  }),

  type: z.nativeEnum(PropertyType),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  area: z.number().positive({ message: 'Area must be a positive number' }),
  status: z.nativeEnum(PropertyStatus),
  amenities: z.array(z.string()).optional(),
});


export enum PropertyErrorCode {
  NOT_FOUND = 'Property_ERR_01',
  BAD_REQUEST = 'Property_ERR_02',
}

export class PropertyBadRequestError extends ApplicationError{
  constructor(message: string) {
    super(message, PropertyErrorCode.BAD_REQUEST, HttpStatusCodes.BAD_REQUEST);
  }
}

export class PropertyNotFoundError extends ApplicationError{
  constructor(message: string) {
    super(message, PropertyErrorCode.NOT_FOUND, HttpStatusCodes.NOT_FOUND);
  }
}

export type getAllPropertiesParams= {
    location?: string ,
    pageNumber?: number
}

export interface updatePropertyParams {
id?: string;
_id?: string;
title?: string;
location?: {
city?: string;
locality?: string;
sector?: string;    
};
type?: PropertyType;
price?: number;
area?: number;
status?: PropertyStatus;
amenities?: string[];
}

const PropertyTypeEnum = z.enum(['Residential', 'Commercial', 'TwoBHK', 'ThreeBHK']);
const PropertyStatusEnum = z.enum(['For Sale', 'For Rent']);

// Define the schema
export const updatePropertyParamsSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  location: z
    .object({
      city: z.string().optional(),
      locality: z.string().optional(),
      sector: z.string().optional(),
    })
    .optional(),
  type: PropertyTypeEnum.optional(),
  price: z.number().optional(),
  area: z.number().optional(),
  status: PropertyStatusEnum.optional(),
  amenities: z.array(z.string()).optional(),
});


export type searchQueryParams = {
  page: number;
  keyword?: string;
  priceMin?: number;
  priceMax?: number;
  type?: string;
  city?: string;
  status?: string;
}