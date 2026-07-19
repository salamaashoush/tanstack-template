import { httpClient } from "./httpClient";
import { UserService } from "./services/user.service";

interface ServiceRegistry {
  userService: UserService;
}

// Process-global, so it outlives every request: services registered here must
// stay stateless and derive the caller's identity from the session cookie.
// Per-user state kept in a field would be served to whoever asks next.
const SERVICE_REGISTRY: Partial<ServiceRegistry> = {};

export function getUserService() {
  if (!SERVICE_REGISTRY.userService) {
    SERVICE_REGISTRY.userService = new UserService(httpClient);
  }
  return SERVICE_REGISTRY.userService;
}
