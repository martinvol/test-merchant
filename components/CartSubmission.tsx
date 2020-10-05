import React, { useState, useEffect } from 'react'
import Router from 'next/router'

import { useShoppingCart } from 'use-shopping-cart'
import { fetchPostJSON } from '../utils/api-helpers'


const CartSubmitForm = () => {
  const [loading, setLoading] = useState(false)
  const [cartEmpty, setCartEmpty] = useState(true)
  const {
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

    redirectToCheckout({ sessionId: response.id })
  }

  return (
    <form onSubmit={handleCheckout}>
      <button
        className="cart-style-background"
        type="button"
        onClick={clearCart}
      >
        Clear Cart
      </button>
      <button
        className="cart-style-background"
        type="submit"
        disabled={cartEmpty || loading}
      >
        Checkout with Stripe
      </button>
      <button
        className="cart-style-background"
        type="button"
        onClick={() => Router.push('/valora-checkout')}
        disabled={cartEmpty}
      >
        Checkout with Valora
      </button>
    </form>
  )
}

export default CartSubmitForm
