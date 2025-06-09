import { SetMetadata } from "@nestjs/common";
export const CheckOwnership = (resource: string, paramName: string) =>
  SetMetadata('ownership', { resource, paramName });
