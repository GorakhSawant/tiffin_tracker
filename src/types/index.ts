export interface Member {
  id: string;
  name: string;
}

export interface MemberQuantity {
  memberId: string;
  quantity: number;
}

export interface TiffinOrder {
  id: string;
  date: string;
  members: string[];
  memberQuantities: MemberQuantity[];
  notes?: string;
  totalAmount?: number;
  perPersonAmount?: number;
}

export interface AppState {
  members: Member[];
  orders: TiffinOrder[];
}
