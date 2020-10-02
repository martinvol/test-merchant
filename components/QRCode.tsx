import React, { useState } from 'react'
import QRCode from 'qrcode.react'


type Props = {
  merchantAddress: string
  merchantName: string
  amount: number
  orderID: string
  className?: string
}

function deepLink(addr: string, name:string, amount:number, comment:string): string {
  // Amount is in cents. Will probably need to do more work to localize currencies.
  let amt = amount.toString()
  if (amount != 0) {
    console.error(amt)
    amt = amt.slice(0,amt.length-2) + "." + amt.slice(amt.length-2,amt.length)
    console.error(amt)
  }
  return `celo://wallet/pay?address=${encodeURIComponent(addr)}&displayName=${encodeURIComponent(name)}&currencyCode=USD&amount=${encodeURIComponent(amt)}&comment=${encodeURIComponent(comment)}`
}

const QRCodeElement = ({
  merchantAddress,
  merchantName,
  amount,
  orderID,
  className,
}: Props) => {


  return (<QRCode value={deepLink(merchantAddress, merchantName, amount, orderID)} level="M" includeMargin={true} />)
}

export default QRCodeElement
