import ValoraElement from '../components/ValoraElement'
import { CardElement, Elements } from '@stripe/react-stripe-js'
import getStripe from '../utils/get-stripejs'


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


const ElementsTab = () => {
  return (
    <section className="paymentElements">
      <ValoraElement />
      <Elements stripe={getStripe()}>
        <fieldset className="elements-style">
        <legend>Your payment details:</legend>
        <input
            placeholder="Cardholder name"
            className="elements-style"
            type="Text"
            name="cardholderName"
            // onChange={handleInputChange}
            required
        />
        <div className="FormRow elements-style">
            <CardElement
            options={CARD_OPTIONS}
            />
        </div>
        </fieldset>
        <button
        className="elements-style-background"
        type="submit"
        >
        Submit Payment
        </button>
      </Elements>
    </section>
  )
}

export default ElementsTab
