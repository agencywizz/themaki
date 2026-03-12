"use client";

import { useState, useMemo, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { submitOrder } from "@/lib/webhook";
import { MENU_ITEMS } from "@/lib/menu-data";
import { RESTAURANT_INFO } from "@/lib/config";
import type { OrderType, CartItem, MenuCategory } from "@/lib/types";

interface OrderModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const PHONE_REGEX = /^(\+353\s?8\d{1}\s?\d{3}\s?\d{4}|08\d{1}\s?\d{3}\s?\d{4})$/;

const CATEGORIES: readonly MenuCategory[] = [
  "Sushi Rolls",
  "Nigiri",
  "Starters",
  "Specials",
  "Desserts",
];

const INPUT_CLASS =
  "bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none rounded-lg p-3 w-full";

interface FormErrors {
  readonly name?: string;
  readonly phone?: string;
  readonly address?: string;
  readonly notes?: string;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState<OrderType>("collection");
  const [cart, setCart] = useState<readonly CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const total = useMemo(
    () => cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0),
    [cart]
  );

  const handleClose = useCallback(() => {
    setStep(1);
    setOrderType("collection");
    setCart([]);
    setName("");
    setPhone("");
    setAddress("");
    setNotes("");
    setIsSubmitting(false);
    setErrors({});
    onClose();
  }, [onClose]);

  const addToCart = useCallback((item: CartItem["item"]) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === itemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((ci) => ci.item.id !== itemId);
      }
      return prev.map((ci) =>
        ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
      );
    });
  }, []);

  const removeItemEntirely = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  }, []);

  const validateStep4 = useCallback((): FormErrors => {
    const newErrors: Record<string, string> = {};
    if (name.length < 2 || name.length > 100) {
      newErrors.name = "Name must be between 2 and 100 characters";
    }
    if (!PHONE_REGEX.test(phone.replace(/\s/g, "").replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid Irish phone number (08x... or +353...)";
    }
    if (orderType === "delivery" && address.trim().length < 5) {
      newErrors.address = "Delivery address is required";
    }
    if (notes.length > 500) {
      newErrors.notes = "Notes must be 500 characters or less";
    }
    return newErrors;
  }, [name, phone, address, notes, orderType]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateStep4();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      items: cart.map((ci) => ({
        id: ci.item.id,
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price,
      })),
      orderType,
      customerName: name,
      customerPhone: phone,
      customerEmail: "",
      deliveryAddress: orderType === "delivery" ? address : undefined,
      notes: notes || undefined,
      total,
    } as const;

    const result = await submitOrder(payload);
    setIsSubmitting(false);

    if (result.success) {
      showToast(result.message, "success");
      handleClose();
    } else {
      showToast(
        `${result.message}. Please call us at ${RESTAURANT_INFO.phone}`,
        "error"
      );
    }
  }, [validateStep4, cart, orderType, name, phone, address, notes, total, showToast, handleClose]);

  const itemsByCategory = useMemo(() => {
    const grouped = new Map<MenuCategory, typeof MENU_ITEMS>();
    for (const category of CATEGORIES) {
      grouped.set(
        category,
        MENU_ITEMS.filter((item) => item.category === category)
      );
    }
    return grouped;
  }, []);

  const getCartQuantity = useCallback(
    (itemId: string) => cart.find((ci) => ci.item.id === itemId)?.quantity ?? 0,
    [cart]
  );

  const stepTitle = step === 1
    ? "Order Type"
    : step === 2
      ? "Menu"
      : step === 3
        ? "Review Cart"
        : "Your Details";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Order — ${stepTitle}`}>
      {/* Step indicators */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${
              s <= step ? "bg-accent" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Order Type */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <p className="text-text-secondary text-sm">How would you like your order?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-4 rounded-xl font-semibold transition-colors ${
                orderType === "delivery"
                  ? "bg-accent text-bg-primary"
                  : "bg-bg-primary border border-white/10 text-text-secondary hover:border-accent"
              }`}
            >
              Delivery
            </button>
            <button
              onClick={() => setOrderType("collection")}
              className={`flex-1 py-4 rounded-xl font-semibold transition-colors ${
                orderType === "collection"
                  ? "bg-accent text-bg-primary"
                  : "bg-bg-primary border border-white/10 text-text-secondary hover:border-accent"
              }`}
            >
              Takeaway
            </button>
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-4 w-full py-3 bg-accent text-bg-primary rounded-xl font-semibold hover:bg-accent/90 transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Browse Menu */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          {/* Cart summary */}
          {cart.length > 0 && (
            <div className="bg-bg-primary rounded-xl p-3 flex items-center justify-between">
              <span className="text-text-secondary text-sm">
                {cart.reduce((sum, ci) => sum + ci.quantity, 0)} item(s)
              </span>
              <span className="text-accent font-semibold">
                &euro;{total.toFixed(2)}
              </span>
            </div>
          )}

          <div className="max-h-[50vh] overflow-y-auto space-y-6 pr-1">
            {CATEGORIES.map((category) => (
              <div key={category}>
                <h3 className="text-text-primary font-semibold mb-2">{category}</h3>
                <div className="space-y-2">
                  {(itemsByCategory.get(category) ?? []).map((item) => {
                    const qty = getCartQuantity(item.id);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-bg-primary rounded-lg p-3"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-text-primary text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-text-secondary text-xs">
                            &euro;{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={qty === 0}
                            className="w-8 h-8 rounded-full bg-white/5 text-text-secondary hover:bg-white/10 disabled:opacity-30 transition-colors"
                          >
                            &minus;
                          </button>
                          <span className="text-text-primary text-sm w-6 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-bg-primary border border-white/10 text-text-secondary rounded-xl font-semibold hover:border-accent transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={cart.length === 0}
              className="flex-1 py-3 bg-accent text-bg-primary rounded-xl font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              Review Cart
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Cart Review */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          {cart.length === 0 ? (
            <p className="text-text-secondary text-center py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-2">
              {cart.map((ci) => (
                <div
                  key={ci.item.id}
                  className="flex items-center justify-between bg-bg-primary rounded-lg p-3"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-text-primary text-sm font-medium">
                      {ci.item.name}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {ci.quantity} &times; &euro;{ci.item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-primary text-sm font-semibold">
                      &euro;{(ci.item.price * ci.quantity).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => removeFromCart(ci.item.id)}
                        className="w-7 h-7 rounded-full bg-white/5 text-text-secondary hover:bg-white/10 transition-colors text-sm"
                      >
                        &minus;
                      </button>
                      <button
                        onClick={() => addToCart(ci.item)}
                        className="w-7 h-7 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItemEntirely(ci.item.id)}
                        className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm ml-1"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-text-secondary font-medium">Total</span>
            <span className="text-accent text-lg font-bold">
              &euro;{total.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-bg-primary border border-white/10 text-text-secondary rounded-xl font-semibold hover:border-accent transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={cart.length === 0}
              className="flex-1 py-3 bg-accent text-bg-primary rounded-xl font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Customer Details */}
      {step === 4 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-text-secondary text-sm mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={INPUT_CLASS}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-text-secondary text-sm mb-1 block">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08x xxx xxxx or +353..."
              className={INPUT_CLASS}
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {orderType === "delivery" && (
            <div>
              <label className="text-text-secondary text-sm mb-1 block">
                Delivery Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your delivery address"
                className={INPUT_CLASS}
              />
              {errors.address && (
                <p className="text-red-400 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          )}

          <div>
            <label className="text-text-secondary text-sm mb-1 block">
              Notes <span className="text-text-secondary/50">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests..."
              rows={3}
              className={INPUT_CLASS}
            />
            {errors.notes && (
              <p className="text-red-400 text-xs mt-1">{errors.notes}</p>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-bg-primary border border-white/10 text-text-secondary rounded-xl font-semibold hover:border-accent transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-accent text-bg-primary rounded-xl font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Placing Order..." : `Place Order — €${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
