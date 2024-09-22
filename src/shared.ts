export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

export interface Observer {
  update(subject: Subject): void;
}

export interface Watch {
  id: number;
  time: string;
  light: boolean;
}
