import { NextPage } from 'next'
import Layout from '../components/Layout'

import Cart from '../components/Cart'
import CartSummary from '../components/CartSummary'
import Products from '../components/Products'
import ElementsTab from '../components/ElementsTab'


const IndexPage: NextPage = () => {
  return (
    <Layout title="Shopping Cart | Next.js + TypeScript Example">
    <div className="page-container">
      <h1>Shopping Cart</h1>
      <Cart>
        <Products />
        <CartSummary />
        <ElementsTab />
      </Cart>
    </div>
  </Layout>
  )
}

export default IndexPage
