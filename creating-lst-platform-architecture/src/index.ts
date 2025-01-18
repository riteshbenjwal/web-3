require('dotenv').config();
import express from 'express';
import { burnTokens, mintTokens, sendNativeTokens } from './mintTokens';

const app = express();
app.use(express.json());


app.get('/helius',(req,res)=>{
    res.status(400).json({
        msg: "working"
    })
})
 

app.post('/helius', async(req, res) => {
    const fromAddress = req.body.nativeTransfers[0].fromUserAccount;
    const toAddress = req.body.nativeTransfers[0].toUserAccount;
    const amount = req.body.nativeTransfers[0].amount;
    const type = "received_native_sol";

    if (type === "received_native_sol") {
        await mintTokens(fromAddress, toAddress, amount);
    } else {
        await burnTokens(fromAddress, amount);
        await sendNativeTokens(fromAddress, toAddress, amount);
    }

    res.send('Transaction successful');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});