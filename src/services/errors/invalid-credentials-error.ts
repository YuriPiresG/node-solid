export class InvalidCreditionalsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCreditionalsError";
  }
}