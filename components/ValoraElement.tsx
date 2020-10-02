import React, { useState } from 'react'
import QRCodeElement from './QRCode'


type Props = {
  name: string
  useValoraInputName: string
  useValoraDefault: boolean
  accountInputName: string
  phoneInputName: string
  checkoutAmount: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const ValoraElement = ({
  name,
  useValoraInputName,
  useValoraDefault,
  accountInputName,
  phoneInputName,
  checkoutAmount,
  onChange,
  className,
}: Props) => {
  const [payment, setPayment] = useState({ status: 'initial' })
  const [errorMessage, setErrorMessage] = useState('')
  const [checked, setChecked] = useState(useValoraDefault)

  const handleCheckboxInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setChecked(!checked)
    console.log(e.currentTarget)
    onChange(e)
  }

  // const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  //   // TODO input formatting/correction in addition to calling passed in onChange
  //   // input handling, error formats, etc. (check if number/account match, etc. etc.)
  //   onChange(e)
  // }

  return (
  <div className="FormRow elements-style">
    <fieldset className="elements-style" name={name}>
      <legend>Your Valora account details:</legend>
      <div>
        <label>Pay with Valora?</label>
        <input
          type="checkbox"
          name={useValoraInputName} 
          // value={checked}
          checked={checked}
          onChange={handleCheckboxInput}
        />
      </div>
      <div>
        <label>Telephone Number</label>
        <input 
          type="tel"
          name={phoneInputName}
          placeholder="(123) 456 - 789"
          onChange={onChange}
        />
      </div>
      <div>
        <label>Account Number</label>
        <input
          type="text"
          name={accountInputName}
          placeholder="0x112 asd1 1d23 asd1 1d23 asd1 1d23 "
          onChange={onChange}
        />
      </div>
    </fieldset>
    <fieldset className="elements-style" name={name}>
      <legend>QR Code for Valora</legend>
      <QRCodeElement
        merchantAddress="0xA2C09Ca0a3902ca5e43017159B975c5780cfd4F7"
        merchantName="Seal Sellers Super Sick Symposium"
        amount={checkoutAmount}
        orderID="XKCD"
      />
    </fieldset>
  </div>
  )
}
export default ValoraElement
