type Listener = () => void;

const globalForHub = globalThis as typeof globalThis & {
  stgListeners?: Set<Listener>;
};

const listeners = (globalForHub.stgListeners ??= new Set<Listener>());

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyBookingsChanged() {
  for (const listener of listeners) {
    try {
      listener();
    } catch {
      /* ignore dropped clients */
    }
  }
}
