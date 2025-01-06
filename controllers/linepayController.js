const { requestOnlineAPI } = require("../linepay_api_utils");
require("dotenv").config();

const LINE_PAY_API_URL = process.env.LINE_PAY_API_URL;
const BACKEND_NGROK_URL = process.env.BACKEND_NGROK_URL;
const FRONTED_URL = process.env.FRONTED_URL;

//1. 付款請求
const Payment = async (req, res) => {
    const { packages, orderId } = req.body;
    try {
        let response = await requestOnlineAPI({
            method: "POST",
            baseUrl: LINE_PAY_API_URL,
            apiPath: "/v3/payments/request",
            data: {
                amount: packages.amount,
                currency: "TWD",
                orderId,
                packages: [
                    packages
                ],
                redirectUrls: {
                    confirmUrl: `${BACKEND_NGROK_URL}/confirm`,
                    cancelUrl: `${BACKEND_NGROK_URL}/cancel`,
                },
            },
        })
        res.json({ response });
        console.log(response);

    } catch (error) {
        res.status(500).json({ "Payment Error": error.message });
    }
}

//2. 付款授權
const Confirm = async (req, res) => {
    const { transactionId, orderId } = req.query;
    try {
        let response = await requestOnlineAPI({
            method: "POST",
            baseUrl: LINE_PAY_API_URL,
            apiPath: `/v3/payments/${transactionId}/confirm`,
            data: {
                amount: 150, //去資料庫中撈出該筆 order_id 的資料，並且將 amount 填進去
                currency: 'TWD',
            }
        })
        if(response?.returnCode === '0000'){
            const redirectUrl = `${FRONTED_URL}/checkoutDetail?transactionId=${transactionId}&status=success`;
            res.redirect(redirectUrl);
        } else {
            console.log('test')
            const redirectUrl = `${FRONTED_URL}/checkoutDetail?transactionId=${transactionId}&status=failed`;
            res.redirect(redirectUrl);
        }
    } catch (error) {
        res.status(500).json({ "Confirm Error": error.message });
    }
}

module.exports = { Payment, Confirm };