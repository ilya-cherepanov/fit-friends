export interface Subscriber {
  id: number;
  name: string;
  email: string;
  coaches: {
    id: number;
    name: string;
    trainings: {
      id: number,
      title: string;
      description: string;
    }[]
  }[];
}
