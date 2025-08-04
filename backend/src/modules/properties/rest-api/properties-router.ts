import { authMiddleware, authorizeAccess } from "../../../middlewares/authMiddleware";
import { searchRateLimiter } from "../../../services/rate-limiter";
import { Role } from "../../../types";
import { ApplicationRouter } from "../../Application/application-router";
import propertiesController from "./properties-controller";

export default class propertiesRouter extends ApplicationRouter {
  configure(): void {
    const ctrl = new propertiesController();

    
    this.router.get("/getAllproperties",ctrl.getAllProperties);
    this.router.get("/properties/:id", ctrl.getPropertiesById);

    this.router.post("/createProperty",authMiddleware, authorizeAccess(Role.ADMIN), ctrl.addProperty);
    this.router.delete("/delete/:id",authMiddleware,authorizeAccess(Role.ADMIN), ctrl.deletePropertiesById);
    this.router.patch("/update/:id",authMiddleware ,authorizeAccess(Role.ADMIN), ctrl.updatePropertyById);
    this.router.get('/search',authMiddleware ,searchRateLimiter, authorizeAccess(Role.ADMIN, Role.USER), ctrl.searchProperties);
    
    
  }
}
