import mongoose, { Document } from "mongoose";

enum PropertyType {
  Residential = 'Residential',
  Commercial = 'Commercial',
  TwoBHK = '2BHK',
  ThreeBHK = '3BHK',
}

enum PropertyStatus {
  ForSale = 'For Sale',
  ForRent = 'For Rent',
}

interface property extends Document{
title: string;
location: {
city: string;
locality: string;
sector?: string;    
};
type: PropertyType;
price: number;
area: number;
status: PropertyStatus;
amenities?: string[];
}

const propertySchema = new mongoose.Schema<property>({
    title: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        locality: { type: String, required: true },
        sector: { type: String },
    },
    type: { type: String, enum: Object.values(PropertyType), required: true },
    price: { type: Number, required: true },
    area: { type: Number, required: true },
    status: { type: String, enum: Object.values(PropertyStatus), required: true },
    amenities: { type: [String] },
},
{ timestamps: true });


export { property, propertySchema, PropertyType, PropertyStatus };