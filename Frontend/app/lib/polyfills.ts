/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof globalThis.DisposableStack === "undefined") {
  globalThis.DisposableStack = class DisposableStack {
    private stack: Array<() => void> = [];
    private disposed = false;

    use<T extends { [Symbol.dispose]?: () => void } | null | undefined>(value: T): T {
      if (this.disposed) throw new ReferenceError("Cannot add to a disposed stack.");
      if (value != null && typeof (value as any)[Symbol.dispose] === "function") {
        this.stack.push(() => (value as any)[Symbol.dispose]());
      }
      return value;
    }

    adopt<T>(value: T, onDispose: (value: T) => void): T {
      if (this.disposed) throw new ReferenceError("Cannot add to a disposed stack.");
      this.stack.push(() => onDispose(value));
      return value;
    }

    defer(onDispose: () => void): void {
      if (this.disposed) throw new ReferenceError("Cannot add to a disposed stack.");
      this.stack.push(onDispose);
    }

    move(): DisposableStack {
      if (this.disposed) throw new ReferenceError("Cannot move a disposed stack.");
      const newStack = new DisposableStack();
      newStack.stack = this.stack;
      this.stack = [];
      this.disposed = true;
      return newStack;
    }

    dispose(): void {
      if (this.disposed) return;
      this.disposed = true;
      const errors: any[] = [];
      while (this.stack.length > 0) {
        const fn = this.stack.pop();
        try {
          fn?.();
        } catch (e) {
          errors.push(e);
        }
      }
      if (errors.length > 0) {
        // Technically should throw SuppressedError but this is a minimal polyfill
        throw new Error("Errors occurred during disposal: " + errors.map(e => String(e)).join(", "));
      }
    }

    [Symbol.dispose]() {
      this.dispose();
    }
  } as any;
}

if (typeof Symbol.dispose === "undefined") {
  (Symbol as any).dispose = Symbol("Symbol.dispose");
}

if (typeof Symbol.asyncDispose === "undefined") {
  (Symbol as any).asyncDispose = Symbol("Symbol.asyncDispose");
}
