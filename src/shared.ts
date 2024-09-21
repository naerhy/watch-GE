export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

export interface Observer {
  update(subject: Subject): void;
}
