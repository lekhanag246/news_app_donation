const express = require('express');
const app = express();
const cors = require('cors');
const Razorpay = require('razorpay')
const shortid = require('shortid')
const crypto = require('crypto')
const fs = require('fs')

let instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

let razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
})

app.post('/donate', (req, res) => {
    let { amount, name } = req.body
    if (amount == undefined || amount < 0) {
        res.status(400).send({
            status: "amount can't be less than 0 "
        })
    }
    let options = {
        amount: amount * 100,  // amount in the smallest currency unit 100p 1000=10rs
        currency: "INR",
        receipt: "rep" + shortid.generate(),
        payment_capture: 1
    };
    razorpay.orders.create(options, function (err, order) {
        if (err) {
            console.error(err);
            res.status(400).send({
                status: "error"
            })
        }
        else {
            // console.log(order.id)
            res.status(200).send({
                status: "success",
                data: {
                    orderId: order.id,
                    amount: amount * 100,
                    currency: "INR"
                }
            })
        }
    });
})

app.post('/verify-payment', (req, res) => {
    //email customer 
    //and show in ui 
    //add payment info - order id ,invoice to db
    console.log(req.body)
    const shasum = crypto.createHmac('sha256', process.env.SECRET)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')
    console.log(digest, req.headers['x-razorpay-signature'])
    if (digest === req.headers['x-razorpay-signature']) {
        //prcoess it
    } else {
        //req is from unautorised source so 502
    }
    res.json({ status: 'ok' })
})

app.post('/payment-successful', (req, res) => {
    console.log(req.body);
    let { razorpay_payment_id, razorpay_signature } = req.body;
    // order id from server
    // let generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);

    // if (generated_signature == razorpay_signature) {
    // payment is successful
    // }
    if (razorpay_payment_id) {
        let file = fs.readFileSync(__dirname + `/thankyou.html`, 'utf-8')
        res.status(200).send(file)
    }
    else {
        res.status(400).json({
            status: 'failure'
        })
    }
})


app.listen(process.env.PORT, (error) => {
    if (error) {
        console.error("error with server");
    } else {
        console.info("successfully created server " + process.env.PORT)
    }
})

// const obj = {
//     "entity": "event",
//     "account_id": "acc_N89fuRwgI53lt5",
//     "event": "payment.captured",
//     "contains": [
//         "payment"
//     ],
//     "payload": {
//         "payment": {
//             "entity": {
//                 "id": "pay_N92Y63RyhWZ64S",
//                 "entity": "payment",
//                 "amount": 20000,
//                 "currency": "INR",
//                 "base_amount": 20000,
//                 "status": "captured",
//                 "order_id": null,
//                 "invoice_id": null,
//                 "international": false,
//                 "method": "upi",
//                 "amount_refunded": 0,
//                 "amount_transferred": 0,
//                 "refund_status": null,
//                 "captured": true,
//                 "description": "News should be independent",
//                 "card_id": null,
//                 "bank": null,
//                 "wallet": null,
//                 "vpa": "9483511062@okaxis",
//                 "email": "void@razorpay.com",
//                 "contact": "+918050012345",
//                 "notes": {
//                     "address": "L-18 ,Jnanabhararti Campus ,Bangalore 560056"
//                 },
//                 "fee": 472,
//                 "tax": 72,
//                 "error_code": null,
//                 "error_description": null,
//                 "error_source": null,
//                 "error_step": null,
//                 "error_reason": null,
//                 "acquirer_data": {
//                     "rrn": "919001058409",
//                     "upi_transaction_id": "58EBE5ABA594951EEEE28F63D8D85B62"
//                 },
//                 "created_at": 1701861431,
//                 "upi": {
//                     "vpa": "9483511062@okaxis"
//                 }
//             }
//         }
//     },
//     "created_at": 1701861629
// }
// unable to get req.body but we got this from ngrok

// const onj2 = {
//     entity: 'event',
//     account_id: 'acc_N89fuRwgI53lt5',
//     event: 'payment.captured',
//     contains: ['payment'],
//     payload: { payment: { entity: [Object] } },
//     created_at: 1701874602
// }