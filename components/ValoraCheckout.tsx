import React, { useState, useRef, useEffect } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import QRCodeElement from './QRCode'
import PacmanLoader from "react-spinners/PacmanLoader";
import BounceLoader from "react-spinners/BounceLoader";


export function useInterval(callback: () => void, delay: number) {
  const savedCallback: {current: (() => void)} = useRef(callback)
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay != null) {
      const id = setInterval(tick, delay)
      return () => {
        clearInterval(id)
      }
    }
  }, [callback, delay])
}


const ValoraCheckout = () => {
  const CELO_PAY_API_URL = process.env.NEXT_PUBLIC_CELO_PAY_API_URL!
  const CELO_PAY_API_KEY = process.env.NEXT_PUBLIC_CELO_PAY_API_KEY!
  const MERCHANT_ADDRESS = process.env.NEXT_PUBLIC_MERCHANT_ADDRESS!
  const MERCHANT_NAME = process.env.NEXT_PUBLIC_MERCHANT_NAME!

  const [payment, setPayment] = useState({
    status: 'UNSUBMITTED',
    orderID:'',
    qrCodeRequested:false,
    address:'',
    merchantName:""
  })
  const [errorMessage, setErrorMessage] = useState('')
  const {totalPrice} = useShoppingCart()
  // for now, use our custom API names but possibly keep this all matching to Stripe and within API pings map?
  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'NEW':
      case 'PENDING':
        return (<div>
          <h2>Waiting for payment</h2>
        
        <PacmanLoader
              //css={override}
              size={50}
              color={"#123abc"}
              loading={true}
            />
      </div>)
      case 'COMPLETED':
        return <h2>Payment Succeeded 🥳</h2>
      case 'EXPIRED':
      case 'UNRESOLVED':
      case 'ERROR':
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
  const inProgress: string[] = ["NEW", "PENDING"]
  const checkUpdate = async () => {
    
    console.log(`Checking update for ${payment.orderID}`)

    try {
      const rawResponse = await fetch(
        `${CELO_PAY_API_URL}/charges/${payment.orderID}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': CELO_PAY_API_KEY,
          'Content-Type': 'application/json'
        }
        })
      const response = await rawResponse.json()
      if (!inProgress.includes(response.status)) {
        if (!response.hasOwnProperty('status')) {
          setPayment({...payment, "status": "ERROR"})
        }
        else {
          setPayment({...payment, "status": response.status})
          if (response.status != "COMPLETED") {
            setErrorMessage(`Error fetching orderID=${payment.orderID}: ${response.status}`)
          }
        }
      }
      console.log(response)
    } catch(error) {
      setPayment({...payment, "status": "ERROR"})
      setErrorMessage(`Error fetching orderID=${payment.orderID}`)
    }
  }

  useInterval(async () => {
    if (inProgress.includes(payment.status)) {
      await checkUpdate()
    }
  }, 1000)

  // fetch QR data
  if (!payment['qrCodeRequested']){
    setPayment({...payment, "qrCodeRequested":true})
    console.log("starting payment")
    console.log("Requesting order")
    
    fetch(`${CELO_PAY_API_URL}/charges`, {
        method: 'POST',
        headers: {
            'X-API-KEY': CELO_PAY_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "merchantId": "5a816e4d-2330-4dd9-8b80-3b2feaf77c59",
          "total": totalPrice,
          "createdAt": new Date().toISOString(),
          "address": MERCHANT_ADDRESS
        })
    }).then(async rawResponse =>  {
      console.log("QR Code Response")
      const response = await rawResponse.json()
      console.log(response)
      await new Promise(r => setTimeout(r, 2000)); // just for a bit of look and feel
      setPayment({
        ...payment,
        "orderID": response.id,
        "qrCodeRequested":true,
        "status": 'NEW',
        "address": MERCHANT_ADDRESS,
        "merchantName": MERCHANT_NAME
      })
    })
  }
  console.log(errorMessage)
  const qrCodeToShow = 
      <>
      {inProgress.includes(payment['status']) &&
      <>
      <h5>Order ID: {payment.orderID}</h5>
      <fieldset className="elements-style">
      <legend>QR Code for Valora</legend>
      <QRCodeElement
        merchantAddress={payment.address}
        merchantName={payment.merchantName}
        amount={totalPrice}
        orderID={payment.orderID}
      />
      </fieldset>
      </>
    }
    <PaymentStatus status={payment.status} />
    </>
  
  return (
    <div className='valora-checkout'>
      { payment['orderID'] ? 
      qrCodeToShow
      : 
      <>
      <h2>Loading QR Code</h2>
      <BounceLoader
        //css={override}
        size={50}
        color={"#123abc"}
        loading={true}
      />
      </>
    }
    </div>
  )
}
export default ValoraCheckout
