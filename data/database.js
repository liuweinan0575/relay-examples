/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import Sequelize from 'Sequelize';
import _ from 'lodash';

export class Todo {};
export class User {};
export class Post {};
export class Comment {};

const sequelize = new Sequelize('todo', 'root', null, {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: 'data/todo.sqlite'
});

// sequelize
// .authenticate()
// .then(function(err) {
//   console.log('Connection has been established successfully.');
// })
// .catch(function (err) {
//   console.log('Unable to connect to the database:', err);
// });

const UserMD = sequelize.define('user', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  }
});

const TodoMD = sequelize.define('todo', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  text: {
    type: Sequelize.STRING
  },
  complete: {
    type: Sequelize.BOOLEAN
  }
});

const PostMD = sequelize.define('post', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  text: {
    type: Sequelize.STRING
  },
  className: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.STRING
  },
  newer: {
    type: Sequelize.STRING
  },
  older: {
    type: Sequelize.STRING
  },
  // category: {
  //   type: Sequelize.STRING
  // }
});

const CategoryMD = sequelize.define('category', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  text: {
    type: Sequelize.STRING
  }
});

const CommentMD = sequelize.define('comment', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  // postId: {
  //   type: Sequelize.STRING,
  //   foreignKey: true
  // },
  text: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.STRING
  },
  like: {
    type: Sequelize.INTEGER
  }
});

UserMD.hasMany(TodoMD);
TodoMD.belongsTo(UserMD);

UserMD.hasMany(PostMD);
PostMD.belongsTo(UserMD);

CategoryMD.hasMany(PostMD);
PostMD.belongsTo(PostMD);

PostMD.hasMany(CommentMD);
CommentMD.belongsTo(PostMD);



const VIEWER_ID = 'me';
let nextTodoId = 2;
let nextPostId = 2;
let nextCategoryId = 3;
let nextCommentId = 2;
// let nextTodoId = 2;
// added two rows at the initial step
// force: true will drop the table if it already exists
// UserMD.sync({force: true}).then(() => {
//   // User table created
//   return UserMD.create({
//     id: VIEWER_ID
//   });
// }).then((user)=>{
//   TodoMD.sync({force: true}).then(()=>{
//     // Todo table created
//     return TodoMD.bulkCreate([
//       {
//         id: `${nextTodoId++}`,
//         text: 'Taste JavaScript',
//         complete: true,
//         userId: VIEWER_ID
//       },
//       {
//         id: `${nextTodoId++}`,
//         text: 'Buy a unicorn',
//         complete: false,
//         userId: VIEWER_ID
//       }
//     ])
//   })
//
//   CategoryMD.sync({force: true}).then(()=>{
//     // Todo table created
//     return CategoryMD.bulkCreate([
//       {
//         id: `${nextCategoryId++}`,
//         text: 'English',
//       },
//       {
//         id: `${nextCategoryId++}`,
//         text: 'Java',
//       }
//     ]).then((categories)=>{
//       PostMD.sync({force: true}).then(()=>{
//         // Todo table created
//         return PostMD.bulkCreate([
//           {
//             id: `${nextPostId++}`,
//             title: 'On the road again',
//             className: 'on-the-road-again',
//             text: 'test',
//             date: '2016-12-07',
//             userId: VIEWER_ID,
//             categoryId: `0`
//           },
//           {
//             id: `${nextPostId++}`,
//             title: 'I couldn’t take any pictures but this was an amazing thing…',
//             className: 'amazing',
//             text: 'test',
//             date: '2016-12-08',
//             userId: VIEWER_ID,
//             categoryId: `1`
//           },
//           {
//             id: `${nextPostId++}`,
//             title: 'Shopping',
//             className: 'shopping',
//             text: 'test',
//             date: '2016-12-09',
//             userId: VIEWER_ID,
//             categoryId: `1`
//           }
//         ])
//       })
//     })
//   })
// });

// CommentMD.sync({force: true}).then(()=>{
//   // Todo table created
//   return CommentMD.bulkCreate([
//     {
//       id: '0',
//       text: 'the first comment',
//       date: '2016-12-08',
//       like: 3,
//       postId: '0'
//     },
//     {
//       id: '1',
//       text: 'the second comment',
//       date: '2016-12-08',
//       like: 99,
//       postId: '0'
//     }
//   ])
// });

export function addTodo(text, complete) {
  const todo = new Todo();
  todo.complete = !!complete;
  todo.id = `${nextTodoId++}`;
  todo.text = text;
  todo.userId = VIEWER_ID;
  return TodoMD.create(todo).then((td)=>{
    return td.get({ plain: true })});
}

export function addComment({text, postId}) {
  const comment = {
    text,
    id: `${nextCommentId++}`,
    date: '2016-12-09',
    postId
  }
  return CommentMD.create(comment).then((cmt)=>{
    console.log(cmt);
    return cmt.get({ plain: true })});
}

export function changeTodoStatus(id, complete) {
  return TodoMD.findAll({ where: { id } }).then((todos)=>TodoMD.upsert({...todos[0].get({ plain: true }), complete}).then(()=>getTodo(id)));
}

export function likeComment(id) {
  return CommentMD.findAll({ where: { id } }).then((comments)=>{
    const comment = comments[0].get({ plain: true });
    return CommentMD.upsert({...comment, like: comment.like+1}).then(()=>getComment(id))
  });
}

export function getTodo(id) {
  return TodoMD.findAll({ where: { id } }).then((todos)=>todos[0].get({ plain: true }));
}

export function getTodos(status = 'any') {
  return TodoMD.findAll({}).then((todos) => {
    todos = todos.map((todo)=>todo.get({ plain: true }));
    if (status === 'any') {
      return todos;
    } else {
      return todos.filter(todo => todo.complete === (status === 'completed'));
    }
  })
}

export function getPosts(id = '') {
  if (id) {
    return PostMD.findAll({}).then((posts) => {
      posts = posts.map((post)=>post.get({ plain: true }));
      const index = _.findIndex(posts, (post)=>post.id===id);
      let post = {};
      if (posts.length === 1) {
        post = posts[0];
      } else if(index===0){
        post = {...posts[0],newer: posts[1].id}
      } else if (index===posts.length-1) {
        post = {...posts[index],older: posts[index-1].id}
      } else {
        post = {...posts[index],older: posts[index-1].id, newer:posts[index+1].id}
      }
      return [post];
    })

  }
  return PostMD.findAll({}).then((posts) => {
    return posts.map((post)=>post.get({ plain: true }));
  })
}

export function getPost(id) {
  return PostMD.findAll({where: {id}}).then((posts) => {
    return posts.map((post)=>post.get({ plain: true }));
  })
}

export function getComments(postId) {
  return CommentMD.findAll({where: {postId}}).then((comments) => {
    return comments.map((comment)=>comment.get({ plain: true }));
  })
}

export function getComment(id) {
  return CommentMD.findAll({where: {id}}).then((comments) => {
    return comments[0].get({ plain: true });
  })
}

export function getUser(id) {
  return UserMD.find({id}).then((user) => user.get({ plain: true }));
}

export function getViewer() {
  return getUser(VIEWER_ID);
}

export function markAllTodos(complete) {
  const changedTodos = [];
  return getTodos().then((todos) => {
    todos.forEach(todo => {
      if (todo.complete !== complete) {
        todo.complete = complete;
        changedTodos.push(todo);
        TodoMD.upsert(todo);
      }
    });
    return changedTodos;
  });
}


export function removeComment(id) {
  return CommentMD.destroy({ where: { id } });
}

export function removeTodo(id) {
  return TodoMD.destroy({ where: { id } }).then((id)=> {
    return id;
  });
}

export function removeCompletedTodos() {
  return getTodos().then((todos) => {
    todos = todos.filter(todo => todo.complete);
    const todoIds = todos.map((todo)=>todo.id);
    TodoMD.destroy({ where: { id : { $in: todoIds} } });
    return todoIds;
  });
}

export function renameTodo(id, text) {
  return TodoMD.findAll({ where: { id } }).then((todos)=>TodoMD.upsert({...todos[0].get({ plain: true }), text}).then(()=>getTodo(id)));
}
