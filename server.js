

require('mongoose').connect('mongodb://localhost/moloquent');
const app = require('express')();
const bp  = require('body-parser');

app.use(bp.json())
app.use(bp.urlencoded({extended : true}));

app.use('/posts', require('./routes/Posts'))
app.use('/users', require('./routes/User'))

let port = 4000;
app.listen(port, ()=>{
    console.log('app online on port '+ port);
})