import { IbanElement } from '@stripe/react-stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import getStripe from '../utils/get-stripejs'


const IBAN_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: "#32325d",
    }
  },
  supportedCountries: ['SEPA'],
  placeholderCountry: 'DE',
}

const ValoraElement = () => {
  return (
  <div className="FormRow elements-style">
    <Elements stripe={getStripe()}>
      <fieldset className="elements-style">
        <div>
          <label>Telephone Number</label>
          <input type="tel" id="tel" placeholder="(123) 456 - 789"/>
        </div>
        <div>
          <label>Account Number</label>
          <input type="text" id="accountId" placeholder="1x112 asd1 1d23 asd1 1d23 asd1 1d23 "/>
        </div>
        <label>IBAN</label>
        <div id="iban-element">
          <IbanElement options={IBAN_OPTIONS}/>
        </div>
      </fieldset>
      </Elements>
  </div>
  )
}
export default ValoraElement
