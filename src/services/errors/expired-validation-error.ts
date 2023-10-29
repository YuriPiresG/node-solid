export class ExpiredValidationError extends Error {
  constructor() {
    super("Validation is expired.");
    this.name = "ExpiredValidationError";
  }
}
