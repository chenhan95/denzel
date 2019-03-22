var express = require('express');
var graphqlHTTP = require('express-graphql');
var { graphql, buildSchema } = require('graphql');


// 使用 GraphQL Schema Language 创建一个 schema
var schema = buildSchema(`
  type Query {
    movies: [Movie]
    movie(movieId:String): [Movie]
    awesome:[Movie]
    populate: Populate
    search(limit:Int!,metascore:Int!):Search
  }
  
  type Movie {
    link: String
    metascore: Int
    synopsis: String
    title: String
    year: Int
    poster:String
    id:ID
  }
  
 
  type Populate{
  total:Int
  }
  
  type Search{
    limit: Int
    total:Int
    results:[Movie]
   }
`);

module.exports =schema