import { httpClient } from "./httpClient";
import { UserService } from "./services/user.service";

interface ServiceRegistry {
  userService: UserService;
}

const SERVICE_REGISTRY: Partial<ServiceRegistry> = {};

export function getUserService() {
  if (!SERVICE_REGISTRY.userService) {
    SERVICE_REGISTRY.userService = new UserService(httpClient);
  }
  return SERVICE_REGISTRY.userService;
}
