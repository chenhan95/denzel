var express = require('express');
var graphqlHTTP = require('express-graphql');
var { graphql, buildSchema } = require('graphql');
const schema = require('./schema');
var fs = require("fs");
var cors = require("cors")
var bodyParser = require('body-parser');
const imdb = require('./src/imdb');
const MongoClient = require('mongodb').MongoClient;
const user = require('./src/UserMongo');
const url = "mongodb+srv://"+user.username+":"+user.password+"@cluster0-5qosv.mongodb.net/test?retryWrites=true";
const client = new MongoClient(url, { useNewUrlParser: true });
const DENZEL_IMDB_ID = 'nm0000243';
var movies=[];
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var server = app.listen(9292, async function () {
    movies = await imdb(DENZEL_IMDB_ID);
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s", port)
})

app.get('/movies/populate', async function (req, res) {
    res.send(`Total ${movies.length}`);
})

app.get('/movies', function (req, res) {  //must-watch movie
    const awesome = movies.filter(movie => movie.metascore >= 70);
    res.send(JSON.stringify(awesome, null, 2));
})

app.get('/movies/search', function (req, res) {  //must-watch movie
    const limit=req.query.limit;
    const score=req.query.metascore;
    var response={};
    const current = movies.filter(movie => movie.metascore >= score);
    if(current.length<=limit){
        response.limit=limit;
        response.results=current;
        response.total=current.length;
        res.send(JSON.stringify(response, null, 2));
    }
    else{
        var temp=[];
        for(var i=0;i<limit;i++){
            temp.push(current[i]);
            response.limit=limit;
            response.results=temp;
            response.total=current.length;
        }
        res.send(JSON.stringify(response, null, 2));
    }
})

app.get('/movies/:id', async function (req, res) {  //must-watch movie
    var params = req.params;
    const current = movies.filter(movie => movie.id == params.id);
    res.send(JSON.stringify(current, null, 2));
})

app.post('/movies/:id', function (req, res) {
    client.connect(err => {
        const collection = client.db("test").collection("denzel");
    collection.insertOne({
            "movieId":req.params,
            "date":req.body.date,
            "review":req.body.review
        }, function (err, result) {
            if(err){
                return;
            }
            console.log(result.ops[0]._id);
            var response={};
            response._id=result.ops[0]._id;
            res.send(response);
            client.close();
        });
    });
});

var root = {
    movies:()=>{
        var response=[];
        for(let i=0;i<movies.length;i++){
            response.push(new Movie(movies[i]));
        }
        return response;
    },

    movie: ({movieId}) => {
        const current = movies.filter(movie => movie.id == movieId);
        // console.log(current);
        return current;
    },

    awesome:()=>{
        const awesome = movies.filter(movie => movie.metascore >= 70);
        return awesome;
    },

    populate: () => {
        return {total: movies.length};
    },

    search: ({limit,metascore}) => {
        const current = movies.filter(movie => movie.metascore >= metascore);
        var response = {};
        response.limit = limit;
        if (current.length <= limit) {
            response.limit = limit;
            response.results = current;
            response.total = current.length;
        }
        else {
            var temp = [];
            for (var i = 0; i < limit; i++) {
                temp.push(current[i]);
                response.limit = limit;
                response.results = temp;
                response.total = current.length;
            }
        }
        return response;
    }
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));