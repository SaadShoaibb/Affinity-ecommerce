'use client';

import { formatPrice } from '@/lib/utils';
import { useCartStore, type CartItem as CartItemType } from '@/stores/cart-store';
import { Loader2, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

const freeShippingAmount = 15; // $15 for free shipping

const CartItem = ({ item }: { item: CartItemType }) => {
  const { removeItem, updateQuantity } = useCartStore(
    useShallow((state) => ({
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
    }))
  );

  const isFreeItem = item.price === 0;

  return (
    <div key={`cart-item-${item.id}`} className="flex gap-4 p-4 hover:bg-purple-50">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-purple-200">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-purple-900 truncate">
          {item.title}
        </h3>
        <div className="text-sm text-purple-500 mt-1">
          {isFreeItem ? (
            <span className="text-purple-600 font-medium">FREE</span>
          ) : (
            formatPrice(item.price)
          )}
        </div>
        <div className="flex items-center gap-3 mt-2">
          {isFreeItem ? (
            <div className="text-sm text-purple-600 font-medium">
              Prize Item
            </div>
          ) : (
            <>
              <select
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="border border-purple-200 rounded-md px-2 py-1 text-sm bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={`cart-qty-slct-${item.id}-${num}`} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeItem(item.id)}
                className="text-purple-500 text-sm hover:text-purple-600"
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const {
    cartId,
    removeItem,
    updateQuantity,
    items,
    close,
    isOpen,
    syncWithUser,
    setLoaded,
    getTotalPrice,
    getTotalItems,
  } = useCartStore(
    useShallow((state) => ({
      cartId: state.cartId,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      items: state.items,
      close: state.close,
      isOpen: state.isOpen,
      syncWithUser: state.syncWithUser,
      setLoaded: state.setLoaded,
      getTotalPrice: state.getTotalPrice,
      getTotalItems: state.getTotalItems,
    }))
  );

  useEffect(() => {
    const initCart = async () => {
      await useCartStore.persist.rehydrate();
      await syncWithUser();
      setLoaded(true);
    };

    initCart();
  }, []);

  const [loadingProceed, setLoadingProceed] = useState<boolean>(false);
  const handleProceedToCheckout = async () => {
    if (!cartId || loadingProceed) {
      return;
    }
    setLoadingProceed(true);

    try {
      const anyWindow = window as any;
      if (anyWindow.umami) {
        anyWindow.umami.track('proceed_to_checkout', {
          cartId: cartId,
          totalPrice: getTotalPrice(),
          currency: 'USD',
        });
      }
    } catch (e) {
      // Handle error if necessary.
    }

    setLoadingProceed(false);
  };

  const totalPrice = getTotalPrice();

  const remainingForFreeShipping = useMemo(() => {
    return Math.max(0, freeShippingAmount - totalPrice);
  }, [totalPrice]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-purple-900 bg-opacity-50 z-50 transition-opacity backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-4 border-b bg-purple-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-800">Shopping Cart</h2>
              <span className="bg-purple-200 px-2 py-1 rounded-full text-sm font-medium text-purple-800">
                {getTotalItems()}
              </span>
            </div>
            <button
              onClick={close}
              className="p-2 hover:bg-purple-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-purple-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-purple-500 mb-6">
                  Looks like you have not added any items to your cart yet!
                </p>
                <Link
                  href="/"
                  onClick={close}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-purple-100">
                {items.map((item) => (
                  <CartItem key={'cart-item-' + item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t">
              {/* Shipping progress */}
              {remainingForFreeShipping > 0 ? (
                <div className="p-4 bg-purple-50 border-b">
                  <div className="flex items-center gap-2 text-purple-800 mb-2">
                    <span>🚚</span>
                    <span className="font-medium">
                      Add {formatPrice(remainingForFreeShipping)} more for FREE shipping
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (totalPrice / freeShippingAmount) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-purple-50 border-b">
                  <div className="flex items-center gap-2 text-purple-800">
                    <span>✨</span>
                    <span className="font-medium">
                      You have unlocked FREE shipping!
                    </span>
                  </div>
                </div>
              )}

              {/* Order summary & checkout */}
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-500">Subtotal</span>
                    <span className="font-medium text-purple-800">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-500">Shipping</span>
                    <span className="font-medium text-purple-800">
                      {remainingForFreeShipping > 0 ? 'Calculated at checkout' : 'FREE'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-lg text-purple-800">Total</span>
                    <span className="font-bold text-lg text-purple-800">{formatPrice(totalPrice)}</span>
                  </div>

                  <button
                    className="w-full bg-purple-600 text-white py-4 rounded-full font-bold hover:bg-purple-700 transition-colors flex items-center justify-center"
                    onClick={handleProceedToCheckout}
                    disabled={loadingProceed}
                  >
                    {loadingProceed ? (
                      <div className="flex items-center gap-1">
                        Navigating to checkout...
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-purple-500">
                      <span>🔒</span>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-500">
                      <span>🔄</span>
                      <span>30-day returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-500">
                      <span>💳</span>
                      <span>All major payment methods accepted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
