import React, { useState } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import QRCodeElement from './QRCode'


const ValoraCheckout = () => {
  // TODO: find a better way to "pass in" totalPrice from cart total (when redirecting)
  // to reduce the dependency on useShoppingCart
  const {
    totalPrice,
    formattedTotalPrice,
  } = useShoppingCart()

  return (
    <>
    <fieldset className="elements-style">
      <legend>QR Code for Valora</legend>
      <QRCodeElement
        merchantAddress="0xA2C09Ca0a3902ca5e43017159B975c5780cfd4F7"
        merchantName="Seal Sellers Super Sick Symposium"
        amount={totalPrice}
        orderID="XKCD"
      />
    </fieldset>
    </>
  )
}
export default ValoraCheckout
