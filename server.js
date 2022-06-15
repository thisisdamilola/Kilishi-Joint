import express from "express";
import bcrypt from "bcrypt";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc, getDocs, query, where, limit } from "firebase/firestore";
import {config} from "dotenv"
config()
console.log(process.env)


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAnONuqwwQ11nq0R1KdVuZzCfT6K2AVfks",
    authDomain: "e-commerce-site-fadb0.firebaseapp.com",
    projectId: "e-commerce-site-fadb0",
    storageBucket: "e-commerce-site-fadb0.appspot.com",
    messagingSenderId: "35588409523",
    appId: "1:35588409523:web:9d1074cc8a05d70cf908c6"
  };

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();


// init server
const app = express();



// middlewares
app.use(express.static("public"));
app.use(express.json()) // enables form sharing


// routes
// home route
app.get('/', (req, res) => {
    res.sendFile("index.html", { root : "public" })
})


//about route
app.get('/about', (req, res) => {
    res.sendFile("about.html", { root : "public" })
})

// signup
app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root : "public" })
})

app.post('/signup', (req, res) => {
    const { name, email, password, number, tac } = req.body;

    // form validations
    if(name.length < 3){
        res.json({ 'alert' : 'name must be 3 letters long'});
    } else if(!email.length){
        res.json({ 'alert' : 'enter your email'});
    } else if(password.length < 8){
        res.json({ 'alert' : 'password must be 8 letters long'});
    } else if(!Number(number) || number.length < 10){
        res.json({ 'alert' : 'invalid number, please enter valid one'});
    } else if(!tac){
        res.json({ 'alert' : 'you must agree to our terms and condition'});
    } else{
        // store the data in db
        const users = collection(db, "users");

        getDoc(doc(users, email)).then(user => {
            if(user.exists()){
                return res.json({ 'alert' : 'email already exists' })
            } else{
                // encrypt the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;

                        // set the doc
                        setDoc(doc(users, email), req.body).then(data => {
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                            })
                        })
                    })
                })
            }
        })
    }
})

app.get('/login', (req, res) => {
    res.sendFile("login.html", { root : "public" })
})

app.post('/login', (req, res) => {
    let { email, password } = req.body;

    if(!email.length || !password.length){
        return res.json({ 'alert' : 'fill all the inputs' })
    } 

    const users = collection(db, "users");

    getDoc(doc(users, email))
    .then(user => {
        if(!user.exists()){
            return res.json({'alert': 'email does not exists'});
        } else{
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result) {
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email
                    })
                } else{
                    return res.json({ 'alert' : 'password is incorrect'})
                }
            })
        }
    })
})

app.get('/products/:id', (req, res) => {
    res.sendFile("product.html", { root : "public" })
})

// review routes
app.post('/add-review', (req, res) => {
    let { headline, review, rate, email, product } = req.body;
    
    // form validations
    if(!headline.length || !review.length || rate == 0 || email == null || !product){
        return res.json({'alert':'Fill all the inputs'});
    }

    // storing in Firestore
    let reviews = collection(db, "reviews");
    let docName = `review-${email}-${product}`;
    setDoc(doc(reviews, docName), req.body)
    .then(data => {
        return res.json('review')
    }).catch(err => {
        console.log(err)
        res.json({'alert': 'some err occured'})
    });
})

app.post('/get-reviews', (req, res) => {
    let { product, email } = req.body;

    let reviews = collection(db, "reviews");

    getDocs(query(reviews, where("product", "==", product)), limit(4))
    .then(review => {
        let reviewArr = [];

        if(review.empty){
            return res.json(reviewArr);
        }

        let userEmail = false;

        review.forEach((item, i) => {
            let reivewEmail = item.data().email;
            if(reivewEmail == email){
                userEmail = true;
            }
            reviewArr.push(item.data())
        })

        if(!userEmail){
            getDoc(doc(reviews, `review-${email}-${product}`))
            .then(data => reviewArr.push(data.data()))
        }

        return res.json(reviewArr);
    })
})


// 404 route
app.get('/404', (req, res) => {
    res.sendFile("404.html", { root : "public" })
})

app.use((req, res) => {
    res.redirect('/404')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})