const {Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey} = require('@solana/web3.js');

const connection = new Connection(clusterApiUrl('devnet'));

async function airdrop(publicKey, amount) {
    const airdropSignature = await connection.requestAirdrop(new PublicKey(publicKey), amount);
    await connection.confirmTransaction({signature: airdropSignature})
}

airdrop("9hoF7HNzQJAdQHtXnkWjXk7ezZ24uzbZ6ScfqbwuP1TT", LAMPORTS_PER_SOL).then(signature => {
    console.log('Airdrop signature:', signature);
}).catch(error =>{
    console.log("error: ",error);
});