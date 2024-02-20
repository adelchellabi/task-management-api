export interface ResourceServiceInterface<T> {
  findById(resourceId: string): Promise<T>;
  getOwnerId(resource: T): string;
}
