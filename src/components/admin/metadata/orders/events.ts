type RentimisedListener = () => void;

const listeners = new Set<RentimisedListener>();

export function subscribeRentimisedChanged(listener: RentimisedListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function emitRentimisedChanged() {
  listeners.forEach((listener) => listener());
}
