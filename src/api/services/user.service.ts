import type { LoginSchemaOutput, RegisterSchemaOutput } from "~/schema/auth";

import type { HttpClient } from "../httpClient";
import type { UserProfile } from "../models";

const fakeUser: RegisterSchemaOutput = {
  email: "fake@fake.com",
  password: "fake12345",
  confirmPassword: "fake12345",
  name: "Fake User",
  mobile: "1234567890",
  company: "Fake Company",
  jobTitle: "Fake Job",
};

function toProfile({
  password: _password,
  confirmPassword: _confirmPassword,
  ...profile
}: RegisterSchemaOutput): UserProfile {
  return profile;
}

export class UserService {
  // this is a fake database for the sake of the example, but we should use a real api
  private fakeDB: Map<string, RegisterSchemaOutput> = new Map([
    [fakeUser.email, fakeUser],
  ]);
  // Cross-user leak: the service is a process-wide singleton, so this holds the
  // last person to sign in anywhere and getUserProfile hands their details to
  // every authenticated caller. Only survivable because the real profile comes
  // from an API keyed by the caller's bearer token -- do not copy this shape.
  private currentFakeUser: UserProfile | null = null;
  constructor(private readonly httpClient: HttpClient) {}

  async login(payload: LoginSchemaOutput): Promise<UserProfile> {
    // return this.httpClient.post<UserProfile>("/login", payload);
    const user = this.fakeDB.get(payload.email);
    if (!user || user.password !== payload.password) {
      throw new Error("Wrong email or password");
    }
    this.currentFakeUser = toProfile(user);
    return this.currentFakeUser;
  }

  async register(payload: RegisterSchemaOutput): Promise<UserProfile> {
    // return this.httpClient.post<UserProfile>("/register", payload);
    if (this.fakeDB.has(payload.email)) {
      throw new Error("Email already exists");
    }
    this.fakeDB.set(payload.email, payload);
    this.currentFakeUser = toProfile(payload);
    return this.currentFakeUser;
  }

  async getUserProfile(): Promise<UserProfile> {
    // return this.httpClient.get<UserProfile>("/profile");
    return this.currentFakeUser ?? toProfile(fakeUser);
  }
}
