"use client";

import { useState, useCallback, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { submitReservation } from "@/lib/webhook";
import { RESTAURANT_INFO } from "@/lib/config";

interface ReserveModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const PHONE_REGEX = /^(\+353\s?8\d{1}\s?\d{3}\s?\d{4}|08\d{1}\s?\d{3}\s?\d{4})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TIME_SLOTS: readonly string[] = Array.from({ length: 15 }, (_, i) => {
  const totalMinutes = 13 * 60 + i * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
});

function getTomorrow(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function isValidDay(dateStr: string): boolean {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDay();
  return day === 0 || day === 4 || day === 5 || day === 6; // Sun, Thu, Fri, Sat
}

const INPUT_CLASS =
  "bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none rounded-lg p-3 w-full";

interface FormErrors {
  readonly date?: string;
  readonly time?: string;
  readonly guests?: string;
  readonly name?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly notes?: string;
}

export default function ReserveModal({ isOpen, onClose }: ReserveModalProps) {
  const { showToast } = useToast();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const tomorrow = useMemo(() => getTomorrow(), []);

  const handleClose = useCallback(() => {
    setDate("");
    setTime("");
    setGuests(2);
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setIsSubmitting(false);
    setErrors({});
    onClose();
  }, [onClose]);

  const validate = useCallback((): FormErrors => {
    const newErrors: Record<string, string> = {};

    if (!date || date < tomorrow) {
      newErrors.date = "Date must be tomorrow or later";
    } else if (!isValidDay(date)) {
      newErrors.date = "We only accept reservations for Thu, Fri, Sat, and Sun";
    }

    if (!time || !TIME_SLOTS.includes(time)) {
      newErrors.time = "Please select a valid time slot";
    }

    if (guests < 1 || guests > 10) {
      newErrors.guests = "Guests must be between 1 and 10";
    }

    if (name.length < 2 || name.length > 100) {
      newErrors.name = "Name must be between 2 and 100 characters";
    }

    if (!PHONE_REGEX.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid Irish phone number (08x... or +353...)";
    }

    if (email && !EMAIL_REGEX.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (notes.length > 500) {
      newErrors.notes = "Notes must be 500 characters or less";
    }

    return newErrors;
  }, [date, time, guests, name, phone, email, notes, tomorrow]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      name,
      email,
      phone,
      date,
      time,
      guests,
      notes: notes || undefined,
    } as const;

    const result = await submitReservation(payload);
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
  }, [validate, name, email, phone, date, time, guests, notes, showToast, handleClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reserve a Table">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-text-secondary text-sm mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={tomorrow}
              className={INPUT_CLASS}
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="text-text-secondary text-sm mb-1 block">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">Select time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && (
              <p className="text-red-400 text-xs mt-1">{errors.time}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-text-secondary text-sm mb-1 block">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className={INPUT_CLASS}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
          {errors.guests && (
            <p className="text-red-400 text-xs mt-1">{errors.guests}</p>
          )}
        </div>

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

        <div>
          <label className="text-text-secondary text-sm mb-1 block">
            Email <span className="text-text-secondary/50">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={INPUT_CLASS}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

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

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 bg-accent text-bg-primary rounded-xl font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors mt-2"
        >
          {isSubmitting ? "Reserving..." : "Reserve Table"}
        </button>
      </div>
    </Modal>
  );
}
