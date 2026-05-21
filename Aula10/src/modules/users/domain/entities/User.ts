import { randomUUID } from "node:crypto";

type UserProps = {
  id?: string;
  name: string;
  email: string;
  createdAt?: Date;
};

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly createdAt: Date;

  private constructor(props: Required<UserProps>) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.createdAt = props.createdAt;
  }

  public static create(props: UserProps): User {
    const name = props.name.trim();
    const email = props.email.trim().toLowerCase();

    if (!name) {
      throw new Error("User name is required.");
    }

    if (!email || !email.includes("@")) {
      throw new Error("A valid user email is required.");
    }

    return new User({
      id: props.id ?? randomUUID(),
      name,
      email,
      createdAt: props.createdAt ?? new Date()
    });
  }
}
