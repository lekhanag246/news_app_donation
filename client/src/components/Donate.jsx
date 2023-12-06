import React, { useState } from 'react'
import './donate.css'
import axios from 'axios';

function loadScript() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            resolve(true);
            // showRazorPay;
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}


//programatic instentation of sdk
const Donate = () => {
    const [amount, setAmount] = useState(200);
    const [name, setName] = useState("anonymous");

    const handleDonate = async (e) => {
        e.preventDefault();
        let loadedScript = await loadScript();
        if (!loadedScript) {
            alert("failed to load razor pay sdk. are you online ?")
            return
        } else {
            //make post request to match amount and currency
            try {
                let { data } = await axios.post('http://localhost:4000/donate',
                    {
                        name: name == '' ? 'anonymous' : name,
                        amount: amount
                    })
                console.log(data.data)
                let options = {
                    "key": import.meta.env.VITE_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
                    "amount": data.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    "currency": data.data.currency,
                    "name": "Bitcoin News", //your business name
                    "description": "News should be independent",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Free_logo.svg/600px-Free_logo.svg.png",
                    "order_id": data.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                    "callback_url": "http://localhost:4000/payment-successful",
                    "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                        "name": name && "anonymous", //your customer's name
                        // "email": "reader@example.com",
                        // "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
                    },
                    "notes": {
                        "address": "L-18 ,Jnanabhararti Campus ,Bangalore 560056"
                    },
                    "theme": {
                        "color": "#3399cc"
                    }
                };
                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            } catch (error) {
                console.log("error" + error)
            }
        }

    }
    return (
        <main className='donate-main'>
            <h2>Help us remain an independent news source.</h2>
            <form onSubmit={handleDonate}>
                <input type='text' placeholder='Full Name'
                    onChange={(e) => { setName(e.target.value) }} />
                <button type="submit" className='donate-btn'>Click here to donate 200&#x20B9;</button>

                <p style={{ textAlign: 'center', margin: '1em 0' }}>or</p>

                <input type="number" placeholder='Enter any amount ' min='1'
                    onChange={(e) => { setAmount(e.target.value) }} />
                <button type="submit" className='donate-btn'>Donate</button>

            </form>
        </main>
    )
}

export default Donate
