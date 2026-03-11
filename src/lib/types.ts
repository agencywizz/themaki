export type MenuCategory = "Sushi Rolls" | "Nigiri" | "Starters" | "Specials" | "Desserts";

export type OrderType = "delivery" | "collection";

export interface MenuItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: MenuCategory;
  readonly image: string;
  readonly isPopular?: boolean;
}

export interface CartItem {
  readonly item: MenuItem;
  readonly quantity: number;
}

export interface Review {
  readonly id: string;
  readonly author: string;
  readonly rating: number;
  readonly text: string;
  readonly date: string;
}

export interface OrderPayload {
  readonly items: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly quantity: number;
    readonly price: number;
  }>;
  readonly orderType: OrderType;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly customerEmail: string;
  readonly deliveryAddress?: string;
  readonly notes?: string;
  readonly total: number;
}

export interface ReservationPayload {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly date: string;
  readonly time: string;
  readonly guests: number;
  readonly notes?: string;
}
