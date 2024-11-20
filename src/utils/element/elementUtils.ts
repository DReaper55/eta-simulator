export interface ElementUtils<T> {
    create(data: T): void;
    modify(id: string, data: Partial<T>): void;
    destroy(id: string): void;
  }
  