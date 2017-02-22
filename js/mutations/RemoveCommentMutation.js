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

import Relay from 'react-relay';

export default class RemoveCommentMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{removeComment}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveCommentPayload @relay(pattern: true) {
        deletedCommentId,
        post {
          comments
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'post',
      parentID: this.props.postId,
      connectionName: 'comments',
      deletedIDFieldName: 'deletedCommentId',
    }];
  }
  getVariables() {
    return {
      id: this.props.id,
      postId: this.props.postId
    };
  }
  getOptimisticResponse() {
    return {
      deletedCommentId: this.props.id,
    };
  }
}
