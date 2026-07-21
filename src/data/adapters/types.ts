/** The data contract. Mock (localStorage) and API (HTTP) both implement it. */
export interface DataAdapter {
  // --- Read ---
  getAll<T>(collection: string): Promise<T[]>;
  getById<T>(collection: string, id: string): Promise<T | null>;
  getWhere<T>(collection: string, predicate: (item: T) => boolean): Promise<T[]>;

  // --- Write ---
  create<T extends { id: string }>(collection: string, item: T): Promise<T>;
  createMany<T extends { id: string }>(collection: string, items: T[]): Promise<T[]>;
  update<T extends { id: string }>(
    collection: string,
    id: string,
    partial: Partial<T>,
  ): Promise<T>;
  remove(collection: string, id: string): Promise<void>;

  // --- Lifecycle ---
  seed(force?: boolean): Promise<void>;
  clear(): Promise<void>;
}
