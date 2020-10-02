import React, { useState, useEffect } from 'react'

import StripeTestCards from '../components/StripeTestCards'

import { useShoppingCart } from 'use-shopping-cart'
import { fetchPostJSON } from '../utils/api-helpers'


const CartSummary = () => {
  const [loading, setLoading] = useState(false)
  const [cartEmpty, setCartEmpty] = useState(true)
  const {
    formattedTotalPrice,
    cartCount,
    clearCart,
    cartDetails,
    redirectToCheckout,
  } = useShoppingCart()

  useEffect(() => setCartEmpty(!cartCount), [cartCount])

  const handleCheckout: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault()
    setLoading(true)

    const response = await fetchPostJSON(
      '/api/checkout_sessions/cart',
      cartDetails
    )

    if (response.statusCode === 500) {
      console.error(response.message)
      return
    }
    // TODO: instead of this, reload page; still using useCart helpers to display totals
    // incorporate elements instead of Stripe Test cards and such
    redirectToCheckout({ sessionId: response.id })
  }

  return (
    <form onSubmit={handleCheckout}>
      <h2>Cart summary</h2>
      {/* This is where we'll render our cart */}
      <p suppressHydrationWarning>
        <strong>Number of Items:</strong> {cartCount}
      </p>
      <p suppressHydrationWarning>
        <strong>Total:</strong> {formattedTotalPrice}
      </p>
      <button
        className="cart-style-background"
        type="button"
        onClick={clearCart}
      >
        Clear Cart
      </button>
    </form>
  )
}

export default CartSummary
