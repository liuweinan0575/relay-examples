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

import React from 'react';
import Relay from 'react-relay';
import { Layout, Content, Grid, Cell, Card, CardTitle, CardText, FABButton, Icon } from 'react-mdl';

class BlogApp extends React.Component {

  render() {
    const { posts } = this.props.viewer;

    return (
      <div>
        <Layout className="demo-blog">
          <Content>
            {this.props.children}
            <footer className="mdl-mini-footer">
                Contact me
            </footer>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Relay.createContainer(BlogApp, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `
  },
});
