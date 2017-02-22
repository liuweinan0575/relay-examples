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

// import 'todomvc-common';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {IndexRoute, Route, Router} from 'react-router';
import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import BlogApp from './components/BlogApp';
import PostList from './components/PostList';
import PostPage from './components/PostPage';
import ViewerQueries from './queries/ViewerQueries';

import {createHashHistory} from 'history';
import {applyRouterMiddleware, useRouterHistory} from 'react-router';
const history = useRouterHistory(createHashHistory)({ queryKey: false });
const mountNode = document.getElementById('root');
import useRelay from 'react-router-relay';

import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

// render for blog
// ReactDOM.render(
//   <Router
//     environment={Relay.Store}
//     history={history}
//     render={applyRouterMiddleware(useRelay)}>
//     <Route path="/"
//       component={BlogApp}
//       queries={ViewerQueries}>
//       <IndexRoute
//         component={PostList}
//         queries={ViewerQueries}
//       />
//       <Route path="post/:id"
//         component={PostPage}
//         queries={ViewerQueries}
//         prepareParams={(params) => ({id: params.id})}
//       />
//     </Route>
//   </Router>,
//   mountNode
// );

// render for toto
ReactDOM.render(
  <Router
    environment={Relay.Store}
    history={history}
    render={applyRouterMiddleware(useRelay)}>
    <Route path="/"
      component={TodoApp}
      queries={ViewerQueries}>
      <IndexRoute
        component={TodoList}
        queries={ViewerQueries}
        prepareParams={() => ({status: 'any'})}
      />
      <Route path=":status"
        component={TodoList}
        queries={ViewerQueries}
      />
    </Route>
  </Router>,
  mountNode
);
