import { NextPage } from 'next'
import Layout from '../components/Layout'
import Cart from '../components/Cart'
import CartSummary from '../components/CartSummary'
import ValoraCheckout from '../components/ValoraCheckout'


const ValoraCheckoutPage: NextPage = () => {
  return (
    <Layout title="Seal-Labs">
    <div className="page-container">
      <h1>Valora Checkout</h1>
      <Cart>
        <CartSummary />
        <ValoraCheckout />
      </Cart>
    </div>
  </Layout>
  )
}

export default ValoraCheckoutPage
