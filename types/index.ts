export interface Run {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  distance: number;
  pace: number;
  lat: number;
  lng: number;
  created_by: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

export interface RunWithCreator extends Run {
  creator: Profile;
}
export type Filter = {
  proximity?: number;
  distance?: number;
  time?: number;
};
