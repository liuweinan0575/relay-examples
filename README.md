# Relay Example

This project contains two relay examples.

1. The todo example from facebook relay which implements service logic with Sequelize and sqlite;
2. A blog example which makes the react implement of a material design template.

## Installation & Run Running

```
npm install
```

Or you can use *cnpm* for faster install and better module management.

```
npm start
```

Start a local server:

```
const APP_PORT = 3002;
const GRAPHQL_PORT = 8001;
```

You can access the app with port 3002 and the graphql server with port 8001.

## The swith between two examples

The default example is the todo example. It implement the graphql server with Sequelize and sqlite. Go through this example can help you get the idea how to implement a graphql server. 

I search for this kind of examples in github, but cannot find good one. So I decide to implemnt one by myself.

The second one is a react implement of a (material design template)[https://getmdl.io/templates/blog/index.html]. Besides, I implement the R(crud) operation of relay for post and crud operations for comments.

1. You can get three posts(r) in homepage.
2. And you can click the title of each post to acess the detail page, in which you can see the comment of the accessed post, add comment, like comment and delete comment(crud).

To swith to this example, you need to do the following two steps:
1. In js/app.js, comment the ReactDOM.render for todo exmaple and uncomment the one for blog example;
2. In public/style.css, uncomment the three *body::before* setting for three media queries.

## Installation & Run Running
