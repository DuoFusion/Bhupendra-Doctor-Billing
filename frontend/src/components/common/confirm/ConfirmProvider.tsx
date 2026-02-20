import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ConfirmModal from "./ConfirmModal";

type ConfirmIntent = "danger" | "neutral";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  intent?: ConfirmIntent;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

const defaultOptions: Required<ConfirmOptions> = {
  title: "Please Confirm",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  intent: "danger",
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const closeModal = useCallback((value: boolean) => {
    setOpen(false);
    if (resolverRef.current) {
      resolverRef.current(value);
      resolverRef.current = null;
    }
  }, []);

  const confirm = useCallback<ConfirmFn>((incomingOptions) => {
    return new Promise<boolean>((resolve) => {
      const merged = { ...defaultOptions, ...incomingOptions };
      setOptions(merged);
      resolverRef.current = resolve;
      setOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeModal]);

  useEffect(() => {
    return () => {
      if (resolverRef.current) {
        resolverRef.current(false);
        resolverRef.current = null;
      }
    };
  }, []);

  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <ConfirmModal
        open={open}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        intent={options.intent}
        onCancel={() => closeModal(false)}
        onConfirm={() => closeModal(true)}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
};
