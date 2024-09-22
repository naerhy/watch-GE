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

export const utcTimezones = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:30",
  "UTC-09:00",
  "UTC-08:00",
  "UTC-07:00",
  "UTC-06:00",
  "UTC-05:00",
  "UTC-04:00",
  "UTC-03:30",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+03:30",
  "UTC+04:00",
  "UTC+04:30",
  "UTC+05:00",
  "UTC+05:30",
  "UTC+05:45",
  "UTC+06:00",
  "UTC+06:30",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+08:45",
  "UTC+09:00",
  "UTC+09:30",
  "UTC+10:00",
  "UTC+10:30",
  "UTC+11:00",
  "UTC+12:00",
  "UTC+12:45",
  "UTC+13:00",
  "UTC+14:00"
] as const;

export type UtcTimeZone = (typeof utcTimezones)[number];

export const utcOffsets: Record<UtcTimeZone, number> = {
  "UTC-12:00": -720,
  "UTC-11:00": -660,
  "UTC-10:00": -600,
  "UTC-09:30": -570,
  "UTC-09:00": -540,
  "UTC-08:00": -480,
  "UTC-07:00": -420,
  "UTC-06:00": -360,
  "UTC-05:00": -300,
  "UTC-04:00": -240,
  "UTC-03:30": -210,
  "UTC-03:00": -180,
  "UTC-02:00": -120,
  "UTC-01:00": -60,
  "UTC+00:00": 0,
  "UTC+01:00": 60,
  "UTC+02:00": 120,
  "UTC+03:00": 180,
  "UTC+03:30": 210,
  "UTC+04:00": 240,
  "UTC+04:30": 270,
  "UTC+05:00": 300,
  "UTC+05:30": 330,
  "UTC+05:45": 345,
  "UTC+06:00": 360,
  "UTC+06:30": 390,
  "UTC+07:00": 420,
  "UTC+08:00": 480,
  "UTC+08:45": 525,
  "UTC+09:00": 540,
  "UTC+09:30": 570,
  "UTC+10:00": 600,
  "UTC+10:30": 630,
  "UTC+11:00": 660,
  "UTC+12:00": 720,
  "UTC+12:45": 765,
  "UTC+13:00": 780,
  "UTC+14:00": 840
};
