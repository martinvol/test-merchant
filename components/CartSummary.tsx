import React, { useState, useEffect } from 'react'
import Router from 'next/router'

import StripeTestCards from '../components/StripeTestCards'

import { useShoppingCart } from 'use-shopping-cart'
import { fetchPostJSON } from '../utils/api-helpers'


const CartSummary = () => {
  const [cartEmpty, setCartEmpty] = useState(true)
  const {
    formattedTotalPrice,
    cartCount,
  } = useShoppingCart()

  useEffect(() => setCartEmpty(!cartCount), [cartCount])

  return (
    <>
      <h2>Cart summary</h2>
      {/* This is where we'll render our cart */}
      <p suppressHydrationWarning>
        <strong>Number of Items:</strong> {cartCount}
      </p>
      <p suppressHydrationWarning>
        <strong>Total:</strong> {formattedTotalPrice}
      </p>
      </>
  )
}

export default CartSummary
