"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  CART_STORAGE_KEY,
  type CartCatalog,
  type CartLine,
  type SizeBreakdown,
  balanceSizes,
  cartCount,
  cartTotal,
  cleanSizes,
  isLineBalanced,
  newLineId,
  readStoredCart,
  writeStoredCart,
} from "@/lib/cart";

type AddLineInput = {
  slug: string;
  quantity: number;
  sizes: SizeBreakdown;
  colors: string;
  notes: string;
};

type CartContextValue = {
  catalog: CartCatalog;
  lines: CartLine[];
  /** False until localStorage has been read, so nothing renders a wrong count. */
  ready: boolean;
  count: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (input: AddLineInput) => boolean;
  updateLine: (id: string, patch: Partial<Omit<CartLine, "id" | "slug">>) => void;
  setLineQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}

/**
 * Holds the cart for the whole app.
 *
 * The cart is client-side only — there is no account, no session and no order
 * database. localStorage survives a reload and a closed tab, which is what a
 * coach building a roster order over two sittings needs, and it is read back
 * through `normalizeLines` so a stale or hand-edited entry cannot enter the UI.
 */
export function CartProvider({
  catalog,
  children,
}: {
  catalog: CartCatalog;
  children: React.ReactNode;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLines(readStoredCart(catalog));
    setReady(true);
  }, [catalog]);

  // Another tab of the same site edited the cart.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== null && event.key !== CART_STORAGE_KEY) return;
      setLines(readStoredCart(catalog));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [catalog]);

  const commit = useCallback((next: CartLine[]) => {
    setLines(next);
    writeStoredCart(next);
  }, []);

  const addLine = useCallback(
    (input: AddLineInput) => {
      const product = catalog[input.slug];
      if (!product) return false;

      const quantity = Math.floor(input.quantity);
      const sizes = cleanSizes(input.sizes, product.sizeRun);
      const line: CartLine = {
        id: newLineId(),
        slug: input.slug,
        quantity,
        sizes,
        colors: input.colors.trim().slice(0, 200),
        notes: input.notes.trim().slice(0, 600),
        addedAt: Date.now(),
      };

      // Last line of defense: an unbalanced or under-minimum line never enters
      // the cart, whatever the calling component believed.
      if (quantity < product.minimum || !isLineBalanced(line)) return false;

      commit([...lines, line]);
      setIsOpen(true);
      return true;
    },
    [catalog, commit, lines],
  );

  const updateLine = useCallback(
    (id: string, patch: Partial<Omit<CartLine, "id" | "slug">>) => {
      commit(
        lines.map((line) => {
          if (line.id !== id) return line;
          const product = catalog[line.slug];
          const next = { ...line, ...patch };
          if (!product) return line;
          const quantity = Math.max(product.minimum, Math.floor(next.quantity));
          const sizes = cleanSizes(next.sizes, product.sizeRun);
          return {
            ...next,
            quantity,
            // The invariant is kept here as well as in the editor, so no code
            // path can leave a stored line whose sizes miss its quantity.
            sizes: balanceSizes(sizes, quantity, product.sizeRun),
          };
        }),
      );
    },
    [catalog, commit, lines],
  );

  const setLineQuantity = useCallback(
    (id: string, quantity: number) => {
      commit(
        lines.map((line) => {
          if (line.id !== id) return line;
          const product = catalog[line.slug];
          if (!product) return line;
          const next = Math.max(product.minimum, Math.floor(quantity) || product.minimum);
          return { ...line, quantity: next, sizes: balanceSizes(line.sizes, next, product.sizeRun) };
        }),
      );
    },
    [catalog, commit, lines],
  );

  const removeLine = useCallback(
    (id: string) => commit(lines.filter((line) => line.id !== id)),
    [commit, lines],
  );

  const clearCart = useCallback(() => commit([]), [commit]);

  const value = useMemo<CartContextValue>(
    () => ({
      catalog,
      lines,
      ready,
      count: cartCount(lines),
      total: cartTotal(lines, catalog),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addLine,
      updateLine,
      setLineQuantity,
      removeLine,
      clearCart,
    }),
    [addLine, catalog, clearCart, isOpen, lines, ready, removeLine, setLineQuantity, updateLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
