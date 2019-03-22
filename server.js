var express = require('express');
var graphqlHTTP = require('express-graphql');
var { graphql, buildSchema } = require('graphql');
const imdb = require('./src/imdb');
const schema = require('./schema');
const DENZEL_IMDB_ID = 'nm0000243';
var movies=[];
var app = express();

// root 提供所有 API 入口端点相应的解析器函数
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
                response.total = limit;
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


var server = app.listen(9292, async function () {
    movies = await imdb(DENZEL_IMDB_ID);
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s", port)
})

console.log('Running a GraphQL API server at localhost:4000/graphql');