import { NextPage } from 'next'
import Layout from '../components/Layout'

import Cart from '../components/Cart'
import CartSummary from '../components/CartSummary'
import CartElementForm from '../components/CartElementForm'
import Products from '../components/Products'
import ElementsTab from '../components/ElementsTab'
import getStripe from '../utils/get-stripejs'
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import ElementsForm from '../components/ElementsForm'


const IndexPage: NextPage = () => {
  return (
    <Layout title="Seal-Labs">
    <div className="page-container">
      <h1>Seal-Labs Store</h1>
      <h2>Shopping Cart</h2>
      <Cart>
        <Products />
        <CartSummary />
        <Elements stripe={getStripe()}>
          <CartElementForm />
        </Elements>
        {/* <Elements stripe={getStripe()}>
          <ElementsForm />
        </Elements> */}
      </Cart>
    </div>
  </Layout>
  )
}

export default IndexPage
