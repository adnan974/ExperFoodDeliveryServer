const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const secret = "sz,sopfiION45OIF5DNn6nNIUJIByUyÈ_Ç_hhÈT--Èè-((U6azaa454f4eIIKNO4545dsz";


const userTest = {id:1, firstname : 'John', lastname:'DOE',email:'test@email.com', password : '1234', address:'124 allée des cocos', cp:'97450', city:'Saint-Louis'};

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());

const api = express.Router();
const auth = express.Router();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});


auth.post('/login', (req,res)=> {   
    if (req.body && req.body.email && req.body.password) {     
        const email = req.body.email.toLocaleLowerCase();
        const password = req.body.password;

        if(userTest.email === email && userTest.password === password) {            
            delete req.body.password;

            const token = jwt.sign({ iss:'http://localhost:5000', role:'customer'}, secret);
            
            res.json({success:true, data: userTest, token});
            
        }else {            
            res.json({success:false, message:"invalid credentials"});
        }
    }else {
        res.json({success:true, message:'missing datas'})
    }
})

auth.get('/restaurants', (req,res)=> {
    res.json({success: true, data : [{id : 1, name: 'Restaurant 1'}, {id : 2, name: 'Restaurant 2'} ]});

})

api.get('/restaurants', (req,res)=> {
    res.json({success: true, data : [{id : 1, name: 'Restaurant 1'}, {id : 2, name: 'Restaurant 2'} ]});

})

app.use('/api', api);
app.use('/auth', auth);

const port = 5000;

app.listen(port, ()=> {
    console.log( `listening on port ${port}`);
} )