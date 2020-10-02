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
    <Layout title="Shopping Cart | Next.js + TypeScript Example">
    <div className="page-container">
      <h1>Shopping Cart</h1>
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
