import { NotImplementedError } from "../../../../shared/errors/NotImplementedError.js";

export type UserProps = {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
};

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly passwordHash: string;
  public readonly createdAt: Date;

  private constructor(props: Required<UserProps>) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt;
  }

  public static create(_props: UserProps): User {
    throw new NotImplementedError("Implement user creation and validation rules.");
  }
}
