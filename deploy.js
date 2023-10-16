const web3 = require('@solana/web3.js');
const { Connection, PublicKey, Keypair, clusterApiUrl } = web3
const fs = require('fs').promises;
const Base58 = require('bs58');
const BufferLayout = require('buffer-layout');

const keypairpath = "./secret.json";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const loadWalletKey = async (keypair) => {
    if (!keypair || keypair == '') {
        throw new Error('Keypair is required!');
    }
    const keypairbuf = await fs.readFile(keypair)
    const loaded = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(keypairbuf.toString())),
    );

    console.log(`wallet public key: ${loaded.publicKey}`);
    return loaded;
}

const  loadWalletSecretKey = (key) => {
    // console.log(key);
    const loaded = Keypair.fromSecretKey(Base58.decode(key));
    console.log(`wallet public key: ${loaded.publicKey}`);
    return loaded;
}

(async () => {
    console.log("\n-->1 Create Payer Account : who will pay for deployment")
    const payerAccount = await loadWalletKey(keypairpath);

    console.log("publicKey:", payerAccount.publicKey.toBase58())
    console.log("secret key array", Base58.encode(payerAccount.secretKey));
    // const test = [];
    // test.push(payerAccount.secretKey);
    // test.push(payerAccount.publicKey);
    // console.log("test", test);

    return;

    console.log("\n-->2 Air drop money to Payer Account ...");
    const devnet = clusterApiUrl('devnet') // "https://api.devnet.solana.com"
    const conn = new Connection(devnet)
    await conn.requestAirdrop(payerAccount.publicKey, 20000000000)
    // await sleep(10000)
    // return
    // console.log("1")
    // await conn.requestAirdrop(payerAccount.publicKey, 1000000000)
    // await sleep(10000)
    // console.log("2")
    // await conn.requestAirdrop(payerAccount.publicKey, 1000000000)
    // await sleep(10000)
    // console.log("3")
    // await conn.requestAirdrop(payerAccount.publicKey, 1000000000)
    // await sleep(15000)
    // console.log("4")
    // await conn.requestAirdrop(payerAccount.publicKey, 1000000000)
    // await sleep(15000)
    // console.log("5")
    // await conn.requestAirdrop(payerAccount.publicKey, 1000000000)
    // await sleep(15000)
    // console.log("6")
    // await conn.requestAirdrop(payerAccount.publicKey, 1000000000)
    // await sleep(15000)
    // console.log("7")
    // await conn.requestAirdrop(payerAccount.publicKey, 1000000000)
    // await sleep(15000)
    // console.log("8")
    // await conn.requestAirdrop(payerAccount.publicKey, 1000000000)
    // await sleep(15000)
    // console.log("9")
    // await conn.requestAirdrop(payerAccount.publicKey, 1000000000)
    // await sleep(15000)
    // console.log("10")
    console.log("\n-->3 Create Program Account : smart contract need separate account to attach.");
    const programAccount = new Keypair()
    const programId = programAccount.publicKey
    console.log('Program loaded to account')
    console.log("programId:", programId.toBase58())
    fs.writeFile('./program/Program_id.txt', programId.toBase58(), (err) => {
        if(err) throw err;
    })
    console.log("\n-->4 Loading Program to Account : upload smart contract using BPF LOADER ...");
    const program = await fs.readFile('./program/program.so')
    // console.log("output stream", program)
    await web3.BpfLoader.load(conn, payerAccount, programAccount, program, web3.BPF_LOADER_PROGRAM_ID)

    console.log({ result: "!!!!   SUCCESSS  !!!!" })
    await sleep(1500000)
})()