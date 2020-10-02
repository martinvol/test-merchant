import React, { useState } from 'react'


type Props = {
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const ValoraElement = ({
  name,
  onChange,
  className,
}: Props) => {
  const [input, setInput] = useState({
    phoneNumber: null,
    accountId: '',
  })
  const [payment, setPayment] = useState({ status: 'initial' })
  const [errorMessage, setErrorMessage] = useState('')

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
    // TODO input formatting/correction
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    })
    console.log(input)
  }

  return (
  <div className="FormRow elements-style">
    <fieldset className="elements-style" name={name}>
      <legend>Your Valora account details:</legend>
      <div>
        <label>Telephone Number</label>
        <input 
          type="tel"
          name="phoneNumber"
          placeholder="(123) 456 - 789"
          onChange={onChange}
        />
      </div>
      <div>
        <label>Account Number</label>
        <input
          type="text"
          name="accountId"
          placeholder="1x112 asd1 1d23 asd1 1d23 asd1 1d23 "
          onChange={onChange}
        />
      </div>
    </fieldset>
  </div>
  )
}
export default ValoraElement
