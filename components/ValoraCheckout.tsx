import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import PrintObject from './PrintObject'
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
  const [payment, setPayment] = useState({
    status: 'UNSUBMITTED',
    orderID:'',
    qrCodeRequested:false,
    address:'',
    merchantName:""
  })
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  console.log(router.query)
  const totalPrice: number = parseInt((router.query.totalPrice! || '').toString())
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
      const response = await fetch(
        `https://py3txmh6a3.execute-api.eu-central-1.amazonaws.com/dev/charges/${payment.orderID}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': 'vxKPstUZaI7jSWAtqIaNa9y8htGAfAD4547sUXh9',
          'Content-Type': 'application/json'
        }
        });
      
      const orderStatus = (await response.json()).status
      if (!inProgress.includes(orderStatus)) {
        setPayment({...payment, "status": orderStatus})
      }
    } catch(error) {
      setPayment({...payment, "status": "ERROR"})
      setErrorMessage(`Error fetching orderID=${payment.orderID}`)
      console.log(error)
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
    
    fetch('https://py3txmh6a3.execute-api.eu-central-1.amazonaws.com/dev/charges', {
        method: 'POST',
        headers: {
            'X-API-KEY': 'vxKPstUZaI7jSWAtqIaNa9y8htGAfAD4547sUXh9',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "merchantId": "2",
          "total": totalPrice,
          "createdAt": "2020-10-05T12:44:00.123Z"
        })
    }).then(async rawResponse =>  {
      console.log("QR Code Response")
      const response = await rawResponse.json()
      console.log(response)
      await new Promise(r => setTimeout(r, 2000)); // just for a bit of look and feel
      // TODO: env var for address; why aren't env vars working?
      setPayment({
        ...payment,
        "orderID": response.id,
        "qrCodeRequested":true,
        "status": 'NEW',
        "address":'0xA2C09Ca0a3902ca5e43017159B975c5780cfd4F7',
        "merchantName":"Seal Sellers Super Sick Symposium"
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
      <h2>Loading QrCode</h2>
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
