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
    /*movie:({movieId})=>{
        for(var i=0;i<movie.length;i++){
            if(movie[i].id==movieId)
                return new
        }

    },*/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            movies:()=>{
        var result=[];
        for(var i=0;i<movie.length;i++){
            if(movies[i].id==movieId)
                result.push(movies[i]);
        }
        return result;
    },

    populate: () => {
        return {total: movies.length};
    },

    metascore: () => {
        return 'Hello world!';
    },
    synopsis: () => {
        return 'Hello world!';
    },
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