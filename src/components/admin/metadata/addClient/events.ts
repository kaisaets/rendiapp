type KasutajadListener = () => void;

const listeners = new Set<KasutajadListener>();

export function subscribeKasutajadChanged(listener: KasutajadListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function emitKasutajadChanged() {
  listeners.forEach((listener) => listener());
}
