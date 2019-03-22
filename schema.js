var express = require('express');
var graphqlHTTP = require('express-graphql');
var { graphql, buildSchema } = require('graphql');


// 使用 GraphQL Schema Language 创建一个 schema
var schema = buildSchema(`
  type Query {
    movies: [Movie]
    movie: Movie
    populate: Populate
  }
  
  type Movie {
  link: String
  metascore: Int
  synopsis: String
  title: String
  year: Int
  }
  
  type Populate{
  total:Int
  }
`);

module.exports =schema