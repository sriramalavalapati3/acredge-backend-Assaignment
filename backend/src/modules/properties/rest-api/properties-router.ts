import { authorizeAccess } from "../../../middlewares/authMiddleware";
import { searchRateLimiter } from "../../../services/rate-limiter";
import { Role } from "../../../types";
import { ApplicationRouter } from "../../Application/application-router";
import propertiesController from "./properties-controller";

export default class propertiesRouter extends ApplicationRouter {
  configure(): void {
    const ctrl = new propertiesController();

    this.router.post("/createProperty", authorizeAccess(Role.ADMIN), ctrl.addProperty);
    this.router.get("/getAllproperties", authorizeAccess(Role.ADMIN, Role.USER),ctrl.getAllProperties);
    this.router.get("/property/:id",authorizeAccess(Role.ADMIN, Role.USER), ctrl.getPropertiesById);
    this.router.delete("/delete/:id",authorizeAccess(Role.ADMIN), ctrl.deletePropertiesById);
    this.router.patch("/update/:id",authorizeAccess(Role.ADMIN), ctrl.updatePropertyById);
    this.router.get('/search',searchRateLimiter, authorizeAccess(Role.ADMIN, Role.USER), ctrl.searchProperties);
  }
}
