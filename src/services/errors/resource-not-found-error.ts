export class ResourceNotFound extends Error {
  constructor() {
    super("This resource was not found");
    this.name = "ResourceNotFoundError";
  }
}
