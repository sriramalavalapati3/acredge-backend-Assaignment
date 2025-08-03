import { ApplicationRouter } from "../../Application/application-router";
import UserController from "./user-controller";

class UserRouter extends ApplicationRouter {
configure(): void {
    const ctrl = new UserController();
    this.router.post('/register', ctrl.register);
    this.router.post('/login', ctrl.login);
}
}

export default UserRouter;