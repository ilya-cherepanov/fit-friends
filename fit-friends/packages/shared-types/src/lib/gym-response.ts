import {GymParameters, Location} from '@fit-friends/core';


export interface GymResponse {
  id: number;
  title: string;
  location: Location;
  isVerified: boolean;
  parameters: GymParameters[];
  photos: string[];
  description: string;
  price: number;
  createdAt: string;
}
