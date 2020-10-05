import React, { useState, useRef, useEffect } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import PrintObject from './PrintObject'
import QRCodeElement from './QRCode'


export function useInterval(callback: () => void, delay: number) {
  const savedCallback: {current: (() => void)} = useRef(callback)
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay != null) {
      const id = setInterval(tick, delay)
      return () => {
        clearInterval(id)
      }
    }
  }, [callback, delay])
}


const ValoraCheckout = () => {
  // TODO: find a better way to "pass in" totalPrice from cart total (when redirecting)
  // to reduce the dependency on useShoppingCart
  const {
    totalPrice,
    formattedTotalPrice,
  } = useShoppingCart()

  const [payment, setPayment] = useState({ status: 'unsubmitted' })
  const [errorMessage, setErrorMessage] = useState('')
  // for now, use our custom API names but possibly keep this all matching to Stripe and within API pings map?
  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'new':
      case 'pending':
        return <h2>Processing...</h2>
      case 'completed':
        return <h2>Payment Succeeded 🥳</h2>
      case 'expired':
      case 'unresolved':
        return (
          <>
            <h2>Error 😭</h2>
            <p className="error-message">{errorMessage}</p>
          </>
        )
      default:
        return null
    }
  }

  const checkUpdate = () => {
    // TODO replace this with real logic, submit request to webhook to check state of payment
    const randStatuses : string[] = ['new', 'pending', 'completed', 'expired', 'unresolved']
    const randIndex: number = Math.floor(Math.random() * randStatuses.length)
    setPayment({ status: randStatuses[randIndex] })
  }

  useInterval(async () => {
    if (payment.status != "unsubmitted") {
      checkUpdate()
    }
  }, 1000)

  const handleConfirmPayment: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault()
    setPayment({"status": "new"})

    // TODO submit API POST Charge

  }

  return (
    <div className='valora-checkout'>
    <fieldset className="elements-style">
      <legend>QR Code for Valora</legend>
      <QRCodeElement
        merchantAddress="0xA2C09Ca0a3902ca5e43017159B975c5780cfd4F7"
        merchantName="Seal Sellers Super Sick Symposium"
        amount={totalPrice}
        orderID="XKCD"
      />
    </fieldset>
    <form onSubmit={handleConfirmPayment}>
      <h3>By confirming, you agree to pay the merchant in your Valora wallet.</h3>
      <button
        className="cart-style-background"
        type="submit"
        disabled={(payment.status != "unsubmitted")}
      >
        Confirm Payment
      </button>
    </form>
    <PaymentStatus status={payment.status} />
    <PrintObject content={payment} />
    </div>
  )
}
export default ValoraCheckout
