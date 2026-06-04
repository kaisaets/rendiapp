export interface ClientRental {
  id: string;
  title: string;
  subtitle: string;
  address?: string;
  image: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  statusInfo?: string;
  activeRentals: ClientRental[];
  completedRentals: ClientRental[];
}
