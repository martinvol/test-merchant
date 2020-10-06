import React, { useState, useRef, useEffect } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
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
  // TODO: find a better way to "pass in" totalPrice from cart total (when redirecting)
  // to reduce the dependency on useShoppingCart
  const {
    totalPrice,
    formattedTotalPrice,
  } = useShoppingCart()

  const [payment, setPayment] = useState({ status: 'unsubmitted', orderID:'', qrCOdeRequested:false, address:'', merchantName:"" })
  const [errorMessage, setErrorMessage] = useState('')
  // for now, use our custom API names but possibly keep this all matching to Stripe and within API pings map?
  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'new':
      case 'pending':
        return (<div>
          <h2>Waiting for payment</h2>
        
        <PacmanLoader
              //css={override}
              size={50}
              color={"#123abc"}
              loading={true}
            />
      </div>)
      case 'completed':
        return <h2>Payment Succeeded 🥳</h2>
      case 'expired':
      case 'unresolved':
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

  const checkUpdate = async () => {
    
    console.log(`Checking update for ${payment.orderID}`)

    try {
      // TODO replace with actual url and response
      const response = await fetch(`http://google.com?paymentID=${payment.orderID}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': 'vxKPstUZaI7jSWAtqIaNa9y8htGAfAD4547sUXh9',
          'Content-Type': 'application/json'
        }
        });
      
      const orderStatus = (await response.json()).status
      if (orderStatus == 'completed'){
        setPayment({...payment, "status": "completed"})
      }
      
    } catch(error) {
      console.log(`Error fetching orderID=${payment.orderID}`)
    }
    
  }

  useInterval(async () => {
    if (payment.status != "unsubmitted") {
      await checkUpdate()
    }
  }, 1000)
  
  
  if (payment['status'] != 'new' && payment['status'] != 'completed'){
    setPayment({...payment, "status": "new"})
  }

  // fetch QR data
  if (!payment['qrCOdeRequested']){
    setPayment({...payment, "qrCOdeRequested":true})
    console.log("starting payment")
    console.log("Requesting order")
    
    fetch('https://py3txmh6a3.execute-api.eu-central-1.amazonaws.com/dev/charges', {
        method: 'POST',
        headers: {
            'X-API-KEY': 'vxKPstUZaI7jSWAtqIaNa9y8htGAfAD4547sUXh9',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"id": "2", "merchantId": "2", "total": totalPrice, "createdAt": "2020-10-05T12:44:00.123Z"})
    }).then(async response =>  {
      console.log("this is response")
      console.log(await response.json())
      await new Promise(r => setTimeout(r, 2000)); // just for a bit of look and feel
      // replace with actual data
      setPayment({...payment, "orderID": "XKCD", "qrCOdeRequested":true, "address":'0xA2C09Ca0a3902ca5e43017159B975c5780cfd4F7', "merchantName":"Seal Sellers Super Sick Symposium"})
    })
  }
     
    
    


  const qrCodeToShow = 
      <>
      {payment['status'] != 'completed' &&
      <fieldset className="elements-style">
      <legend>QR Code for Valora</legend>
      <QRCodeElement
        merchantAddress={payment.address}
        merchantName={payment.merchantName}
        amount={totalPrice}
        orderID={payment.orderID}
      />
      </fieldset>
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
