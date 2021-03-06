import { NextPage } from 'next'
import Layout from '../components/Layout'
import Cart from '../components/Cart'
import Products from '../components/Products'
import CartSummary from '../components/CartSummary'
import CartSubmission from '../components/CartSubmission'


const IndexPage: NextPage = () => {
  return (
    <Layout title="Seal-Labs">
    <div className="page-container">
      <h1>Shopping Cart</h1>
      <Cart>
        <Products />
        <CartSummary />
        <CartSubmission />
      </Cart>
    </div>
  </Layout>
  )
}

export default IndexPage
