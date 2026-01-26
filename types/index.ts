export type Run = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  description?: string;
  distance?: string;
  pace?: number;
  startTime?: number;
}
export type Filter = {
  proximity?: number;
  distance?: number;
  time?: number;
}
