import type { AxiosInstance } from "axios";

import type { LoginSchemaOutput, RegisterSchemaOutput } from "~/schema/auth";

export type UserProfile = Omit<
  RegisterSchemaOutput,
  "password" | "confirmPassword"
>;
const fakeUser: RegisterSchemaOutput = {
  email: "fake@fake.com",
  password: "fake12345",
  confirmPassword: "fake12345",
  name: "Fake User",
  mobile: "1234567890",
  company: "Fake Company",
  jobTitle: "Fake Job",
};
export class UserService {
  // this is a fake database for the sake of the example, but we should use a real api
  private fakeDB: Map<string, RegisterSchemaOutput> = new Map([
    [fakeUser.email, fakeUser],
  ]);
  private currentFakeUser: UserProfile | null = null;
  constructor(private readonly httpClient: AxiosInstance) {}

  async login(payload: LoginSchemaOutput): Promise<UserProfile> {
    // return this.httpClient.post<UserProfile>("/login", payload);
    if (this.fakeDB.has(payload.email)) {
      const user = this.fakeDB.get(payload.email) as RegisterSchemaOutput;
      if (user.password === payload.password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, confirmPassword, ...rest } = user;
        this.currentFakeUser = rest;
        return this.currentFakeUser;
      } else {
        throw new Error("Wrong email or password");
      }
    } else {
      throw new Error("Wrong email or password");
    }
  }

  async register(payload: RegisterSchemaOutput): Promise<UserProfile> {
    // return this.httpClient.post<UserProfile>("/register", payload);
    if (this.fakeDB.has(payload.email)) {
      throw new Error("Email already exists");
    }
    this.fakeDB.set(payload.email, payload);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, confirmPassword, ...rest } = payload;
    this.currentFakeUser = rest;
    return this.currentFakeUser;
  }

  async getUserProfile(): Promise<UserProfile> {
    // return this.httpClient.get<UserProfile>("/profile");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, confirmPassword, ...rest } = fakeUser;
    return this.currentFakeUser || rest;
  }
}
