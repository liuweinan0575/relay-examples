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

import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
  offsetToCursor,
} from 'graphql-relay';

import {
  Todo,
  User,
  Category,
  getCategory,
  getCategories,
  Post,
  getPost,
  getPosts,
  Comment,
  addComment,
  getComment,
  getComments,
  removeComment,
  likeComment,
  addTodo,
  changeTodoStatus,
  getTodo,
  getTodos,
  getUser,
  getViewer,
  markAllTodos,
  removeCompletedTodos,
  removeTodo,
  renameTodo,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Todo') {
      return getTodo(id);
    } else if (type === 'User') {
      return getUser(id);
    } else if (type === 'Category') {
      return getCategory(id);
    } else if (type === 'Post') {
      return getPost(id);
    } else if (type === 'Comment') {
      return getComment(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Todo) {
      return GraphQLTodo;
    } else if (obj instanceof User) {
      return GraphQLUser;
    } else if (obj instanceof Category) {
      return GraphQLCategory;
    } else if (obj instanceof Post) {
      return GraphQLPost;
    } else if (obj instanceof Comment) {
      return GraphQLComment;
    }
    return null;
  }
);

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: globalIdField('Todo'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    complete: {
      type: GraphQLBoolean,
      resolve: (obj) => obj.complete,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: TodosConnection,
  edgeType: GraphQLTodoEdge,
} = connectionDefinitions({
  name: 'Todo',
  nodeType: GraphQLTodo,
});


const GraphQLComment = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    id: globalIdField('Comment'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    date: {
      type: GraphQLString,
      resolve: (obj) => obj.date,
    },
    like: {
      type: GraphQLInt,
      resolve: (obj) => obj.like,
    }
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: CommentsConnection,
  edgeType: GraphQLCommentEdge,
} = connectionDefinitions({
  name: 'Comment',
  nodeType: GraphQLComment,
});

const GraphQLPost = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: globalIdField('Post'),
    title: {
      type: GraphQLString,
      resolve: (obj) => obj.title,
    },
    className: {
      type: GraphQLString,
      resolve: (obj) => obj.className,
    },
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    date: {
      type: GraphQLString,
      resolve: (obj) => obj.date,
    },
    categoryId: {
      type: GraphQLString,
      resolve: (obj) => obj.categoryId,
    },
    comments: {
      type: CommentsConnection,
      args: {
        postId: {
          type: GraphQLString,
          defaultValue: '',
        },
        ...connectionArgs,
      },
      resolve: (obj, {postId, ...args}) => getComments(postId?fromGlobalId(postId).id:postId).then((comments)=>connectionFromArray(comments, args)),
    },
    newer: {
      type: GraphQLString,
      resolve: (obj) => obj.newer?toGlobalId('Post', obj.newer):obj.newer,
    },
    older: {
      type: GraphQLString,
      resolve: (obj) => obj.older?toGlobalId('Post', obj.older):obj.older,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: PostsConnection,
  edgeType: GraphQLPostEdge,
} = connectionDefinitions({
  name: 'Post',
  nodeType: GraphQLPost,
});

const GraphQLCategory = new GraphQLObjectType({
  name: 'Category',
  fields: {
    id: globalIdField('Category'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: CategoriesConnection,
  edgeType: GraphQLCategoryEdge,
} = connectionDefinitions({
  name: 'Category',
  nodeType: GraphQLCategory,
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    todos: {
      type: TodosConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, {status, ...args}) => getTodos(status).then((todos)=>connectionFromArray(todos, args)),
    },
    posts: {
      type: PostsConnection,
      args: {
        id: {
          type: GraphQLString,
          defaultValue: '',
        },
        ...connectionArgs,
      },
      resolve: (obj, {id, ...args}) => getPosts(id?fromGlobalId(id).id:id).then((posts)=>connectionFromArray(posts, args)),
    },
    categories: {
      type: CategoriesConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, {status, ...args}) => getCategories(status).then((categories)=>connectionFromArray(categories, args)),
    },

    totalCount: {
      type: GraphQLInt,
      resolve: () => getTodos().then((todos) => todos.length),
    },
    completedCount: {
      type: GraphQLInt,
      resolve: () => getTodos('completed').then((todos) => todos.length),
    },
  },
  interfaces: [nodeInterface],
});

const Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
    node: nodeField,
  },
});

const GraphQLAddTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    todoEdge: {
      type: GraphQLTodoEdge,
      resolve: (todo) => todo,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({text}) => {
    return addTodo(text).then((todo)=> getTodos().then((todos) => ({
        // cursor: cursorForObjectInConnection(todos, todo),
        cursor: offsetToCursor(todos, todo),
        node: todo,
      })));
  },
});

const GraphQLAddCommentMutation = mutationWithClientMutationId({
  name: 'AddComment',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    postId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    commentEdge: {
      type: GraphQLCommentEdge,
      resolve: (comment) => comment,
    },
    post: {
      type: GraphQLPost,
      resolve: (comment) => getPost(comment.postId),
    }
  },
  mutateAndGetPayload: ({text, postId}) => {
    console.log('fromGlobalId(postId)------', fromGlobalId(postId));
    const { id } = fromGlobalId(postId);
    return addComment({text, postId: id}).then((comment)=> getComments(id).then((comments) => ({
        // cursor: cursorForObjectInConnection(todos, todo),
        cursor: offsetToCursor(comments, comment),
        node: comment,
      })));
  },
});

const GraphQLLikeCommentMutation = mutationWithClientMutationId({
  name: 'LikeComment',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    comment: {
      type: GraphQLComment,
      resolve: (comment) => comment,
    }
  },
  mutateAndGetPayload: ({id}) => {
    const localCommentId = fromGlobalId(id).id;
    return likeComment(localCommentId).then((cmt)=>{
      console.log('mutateAndGetPayload-----------------', cmt);
      return cmt;
    });
  },
});

const GraphQLChangeTodoStatusMutation = mutationWithClientMutationId({
  name: 'ChangeTodoStatus',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    todo: {
      type: GraphQLTodo,
      resolve: (todoPromise) => todoPromise,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id, complete}) => {
    const localTodoId = fromGlobalId(id).id;
    return changeTodoStatus(localTodoId, complete);
  },
});

const GraphQLMarkAllTodosMutation = mutationWithClientMutationId({
  name: 'MarkAllTodos',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    changedTodos: {
      type: new GraphQLList(GraphQLTodo),
      resolve: (changedTodos) => changedTodos,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({complete}) => {
    return markAllTodos(complete);
  },
});

// TODO: Support plural deletes
const GraphQLRemoveCompletedTodosMutation = mutationWithClientMutationId({
  name: 'RemoveCompletedTodos',
  outputFields: {
    deletedTodoIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({deletedTodoIds}) => deletedTodoIds,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: () => {
    const deletedTodoLocalIds = removeCompletedTodos();
    const deletedTodoIds = deletedTodoLocalIds.map(toGlobalId.bind(null, 'Todo'));
    return {deletedTodoIds};
  },
});

const GraphQLRemoveTodoMutation = mutationWithClientMutationId({
  name: 'RemoveTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedTodoId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localTodoId = fromGlobalId(id).id;
    removeTodo(localTodoId);
    return {id};
  },
});

const GraphQLRemoveCommentMutation = mutationWithClientMutationId({
  name: 'RemoveComment',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    postId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedCommentId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    post: {
      type: GraphQLPost,
      resolve: ({removePromise, postId}) => removePromise.then(()=>getPost(postId)),
    }
  },
  mutateAndGetPayload: ({id, postId}) => {
    const localTodoId = fromGlobalId(id).id;
    return {id, removePromise: removeComment(localTodoId), postId };
  },
});

const GraphQLRenameTodoMutation = mutationWithClientMutationId({
  name: 'RenameTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    todo: {
      type: GraphQLTodo,
      resolve: (todo) => todo,
    },
  },
  mutateAndGetPayload: ({id, text}) => {
    const localTodoId = fromGlobalId(id).id;
    return renameTodo(localTodoId, text);
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTodo: GraphQLAddTodoMutation,
    addComment: GraphQLAddCommentMutation,
    removeComment: GraphQLRemoveCommentMutation,
    likeComment: GraphQLLikeCommentMutation,
    changeTodoStatus: GraphQLChangeTodoStatusMutation,
    markAllTodos: GraphQLMarkAllTodosMutation,
    removeCompletedTodos: GraphQLRemoveCompletedTodosMutation,
    removeTodo: GraphQLRemoveTodoMutation,
    renameTodo: GraphQLRenameTodoMutation,
  },
});

export const schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation,
});
