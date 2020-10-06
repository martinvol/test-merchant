import React, { useState, useEffect } from 'react'
import Router from 'next/router'

import { useShoppingCart } from 'use-shopping-cart'
import { fetchPostJSON } from '../utils/api-helpers'


const CartSubmitForm = () => {
  const [loading, setLoading] = useState(false)
  const [cartEmpty, setCartEmpty] = useState(true)
  const {
    totalPrice,
    cartCount,
    clearCart,
    cartDetails,
    redirectToCheckout,
  } = useShoppingCart()

  useEffect(() => setCartEmpty(!cartCount), [cartCount])

  const handleCheckout: React.MouseEventHandler<HTMLButtonElement> = async (
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

    redirectToCheckout({ sessionId: response.id })
  }

  return (
    // <form onSubmit={handleCheckout}>
      <form>
      <button
        className="cart-style-background"
        type="button"
        onClick={clearCart}
      >
        Clear Cart
      </button>
      <button
        className="cart-style-background"
        type="button"
        disabled={cartEmpty || loading}
        onClick={handleCheckout}
      >
        Checkout with Stripe
      </button>
      <button
        className="cart-style-background"
        type="button"
        
        onClick={() => Router.push({pathname: '/valora-checkout', query: {totalPrice: totalPrice}})}
        disabled={cartEmpty}
      >
        Checkout with Valora
      </button>
    </form>
  )
}

export default CartSubmitForm
