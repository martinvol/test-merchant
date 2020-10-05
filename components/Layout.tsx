import React, { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'

type Props = {
  children: ReactNode
  title?: string
  homeHeader?: string
}

const Layout = ({
  children,
  title = '',
  homeHeader = 'Seal-Labs Store'
}: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className="container">
      <h3 className="home-page">
        <Link href="/">{homeHeader}</Link>
      </h3>
      {children}
    </div>
  </>
)

export default Layout
