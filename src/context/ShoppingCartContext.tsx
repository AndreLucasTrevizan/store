import { createContext, ReactNode, useContext, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";

type ShoppingCartProviderProps = {
  children: ReactNode
}

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
}

type CartItem = {
  id: number;
  quantity: number;
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);

  function getItemQuantity(id: number) {
    return cartItems.find(item => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id: number){
    setCartItems(prev => {
      if (prev.find(item => item.id === id) == null) {
        return [...prev, { id, quantity: 1}]
      }

      return prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }

        return item;
      });
    })
  }

  function decreaseCartQuantity(id: number){
    setCartItems(prev => {
      if (prev.find(item => item.id === id)?.quantity === 1) {
        return prev.filter(item => item.id !== id);
      }

      return prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }

        return item;
      });
    })
  }

  function removeFromCart(id: number){
    setCartItems(prev => {
      return prev.filter(item => item.id !== id);
    })
  }

  return <ShoppingCartContext.Provider value={{
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    openCart,
    closeCart,
    cartItems,
    cartQuantity,
  }}>
    {children}
    <ShoppingCart isOpen={isOpen} />
  </ShoppingCartContext.Provider>
}