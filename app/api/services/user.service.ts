import type { AxiosInstance } from "axios";
import type { LoginSchemaOutput, RegisterSchemaOutput } from "~/schema/auth";

interface FakeUserData {
  email: string;
  username: string;
  password: string;
}
export interface UserProfile {
  email: string;
  username: string;
}

export class UserService {
  // this is a fake database for the sake of the example, but we should use a real api
  private fakeDB: Map<string, FakeUserData> = new Map();
  private currentFakeUser: UserProfile | null = null;
  constructor(private readonly httpClient: AxiosInstance) {}

  async login(payload: LoginSchemaOutput): Promise<UserProfile> {
    // return this.httpClient.post<UserProfile>("/login", payload);
    if (this.fakeDB.has(payload.email)) {
      const user = this.fakeDB.get(payload.email) as FakeUserData;
      if (user.password === payload.password) {
        this.currentFakeUser = {
          email: payload.email,
          username: user.username,
        };
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
    this.fakeDB.set(payload.email, {
      email: payload.email,
      username: payload.username,
      password: payload.password,
    });
    this.currentFakeUser = {
      email: payload.email,
      username: payload.username,
    };
    return this.currentFakeUser;
  }

  async getUserProfile(): Promise<UserProfile> {
    // return this.httpClient.get<UserProfile>("/profile");
    const user = this.currentFakeUser;
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
