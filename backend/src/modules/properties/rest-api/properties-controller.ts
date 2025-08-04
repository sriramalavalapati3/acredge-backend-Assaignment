import { NextFunction, Request, Response } from "express";
import propertiesService from "./properties-service";
import HttpStatusCodes from "../../../utils/http";
import { property } from "../../../models/property-model";
import { getAllPropertiesParams, searchQueryParams } from "../types";

export default class propertiesController {
  addProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const property = await propertiesService.addProperty(
        req.body as property
      );
      res.status(HttpStatusCodes.CREATED).json({
        message: "Property added successfully",
        property,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllProperties = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { location, pageNumber } = req.query;
      let params: getAllPropertiesParams = {
        location: typeof location === "string" ? location : "",
        pageNumber: Number(pageNumber),
      };
      const properties = await propertiesService.allGetProperties(params);
      res.status(HttpStatusCodes.OK).send(properties);
    } catch (error) {
      next(error);
    }
  };

  getPropertiesById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { id } = req.params;
      let property = await propertiesService.getPropertyById(id as string);
      res.status(HttpStatusCodes.OK).send(property);
    } catch (error) {
      next(error);
    }
  };

  deletePropertiesById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { id } = req.params;
      await propertiesService.deletePropertyById(id as string);
      res
        .status(HttpStatusCodes.NO_CONTENT)
        .send("property deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  updatePropertyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { id } = req.params;
      let params = {
        id,
        ...req.body,
      };

      await propertiesService.updatePropertyById(params);
      res
        .status(HttpStatusCodes.NO_CONTENT)
        .send("Property Updated SucessFully");
    } catch (error) {
      next(error);
    }
  };

  searchProperties = async(
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
       const searchProperties = await propertiesService.searchProperties(req.query as unknown as searchQueryParams);
       res.status(HttpStatusCodes.OK).json(searchProperties);
    } catch (error) {
      next(error);
    }
  }
}
