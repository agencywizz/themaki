import { N8N_CONFIG } from "./config";
import { OrderPayload, ReservationPayload } from "./types";

interface WebhookResult {
  readonly success: boolean;
  readonly message: string;
}

export async function submitOrder(
  payload: OrderPayload
): Promise<WebhookResult> {
  if (!N8N_CONFIG.ENABLED) {
    return { success: true, message: "Order received (demo mode)" };
  }

  if (!N8N_CONFIG.ORDER_WEBHOOK) {
    return { success: false, message: "Order webhook URL is not configured" };
  }

  try {
    const response = await fetch(N8N_CONFIG.ORDER_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Order submission failed (status ${response.status})`,
      };
    }

    return { success: true, message: "Order submitted successfully" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to submit order: ${errorMessage}`,
    };
  }
}

export async function submitReservation(
  payload: ReservationPayload
): Promise<WebhookResult> {
  if (!N8N_CONFIG.ENABLED) {
    return { success: true, message: "Reservation received (demo mode)" };
  }

  if (!N8N_CONFIG.RESERVE_WEBHOOK) {
    return {
      success: false,
      message: "Reservation webhook URL is not configured",
    };
  }

  try {
    const response = await fetch(N8N_CONFIG.RESERVE_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Reservation submission failed (status ${response.status})`,
      };
    }

    return { success: true, message: "Reservation submitted successfully" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to submit reservation: ${errorMessage}`,
    };
  }
}
