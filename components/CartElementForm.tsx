import React, { useState } from 'react'

import PrintObject from '../components/PrintObject'
import { useShoppingCart } from 'use-shopping-cart'
import { fetchPostJSON } from '../utils/api-helpers'
import * as config from '../config'
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import ValoraElement from '../components/ValoraElement'
// import { CardElement, Elements } from '@stripe/react-stripe-js'
// import getStripe from '../utils/get-stripejs'

const CARD_OPTIONS = {
  iconStyle: 'solid' as const,
  style: {
    base: {
      iconColor: '#6772e5',
      color: '#6772e5',
      fontWeight: '500',
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883',
      },
      '::placeholder': {
        color: '#6772e5',
      },
    },
    invalid: {
      iconColor: '#ef2961',
      color: '#ef2961',
    },
  },
}

const CartElementForm = () => {
  const [input, setInput] = useState({
    cardholderName: '',
  })
  const [payment, setPayment] = useState({ status: 'initial' })
  const [errorMessage, setErrorMessage] = useState('')
  const stripe = useStripe()
  const elements = useElements()
  const {
    totalPrice,
    formattedTotalPrice,
} = useShoppingCart()

  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'processing':
      case 'requires_payment_method':
      case 'requires_confirmation':
        return <h2>Processing...</h2>

      case 'requires_action':
        return <h2>Authenticating...</h2>

      case 'succeeded':
        return <h2>Payment Succeeded 🥳</h2>

      case 'error':
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

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(input)  
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    console.log(input)
    e.preventDefault()
    // Abort if form isn't valid
    if (!e.currentTarget.reportValidity()) return
    setPayment({ status: 'processing' })

    // Create a PaymentIntent with the specified amount.
    const response = await fetchPostJSON('/api/payment_intents', {
      amount: (totalPrice * 0.01).toFixed(2),
    })
    setPayment(response)

    if (response.statusCode === 500) {
      setPayment({ status: 'error' })
      setErrorMessage(response.message)
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements!.getElement(CardElement)

    // Use your card Element with other Stripe.js APIs
    const { error, paymentIntent } = await stripe!.confirmCardPayment(
      response.client_secret,
      {
        payment_method: {
          card: cardElement!,
          billing_details: { name: input.cardholderName },
        },
      }
    )

    if (error) {
      setPayment({ status: 'error' })
      setErrorMessage(error.message ?? 'An unknown error occured')
    } else if (paymentIntent) {
      setPayment(paymentIntent)
    }
  }

  return (
    <>
      <section className="paymentElements">
        <form onSubmit={handleSubmit}>
          <ValoraElement name="valoraElement" onChange={handleInputChange} />
          <fieldset className="elements-style">
            <legend>Your payment details:</legend>
            <input
                placeholder="Cardholder name"
                className="elements-style"
                type="Text"
                name="cardholderName"
                onChange={handleInputChange}
                required
            />
            <div className="FormRow elements-style">
              <CardElement
              options={CARD_OPTIONS}
              onChange={(e) => {
                  if (e.error) {
                  setPayment({ status: 'error' })
                  setErrorMessage(e.error.message ?? 'An unknown error occured')
                  }
              }}
              />
            </div>
            </fieldset>
          <button
            className="elements-style-background"
            type="submit"
            disabled={
                !['initial', 'succeeded', 'error'].includes(payment.status) ||
                !stripe
            }
          >
            Pay {formattedTotalPrice}
          </button>
        </form>
      </section>
      <PaymentStatus status={payment.status} />
      <PrintObject content={payment} />
    </>
  )
}

export default CartElementForm
