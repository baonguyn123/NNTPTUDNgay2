const API_POSTS = 'http://localhost:3000/posts';
const API_COMMENTS = 'http://localhost:3000/comments';

const tbody = document.getElementById('products-container');
function start (){
    fetchPosts();
    createPost();
}
start();
function fetchPosts() {
    fetch(API_POSTS)
     .then(function (response) {
       return response.json();
     })
     .then(function (posts) {
       renderPosts(posts);
     })
}

function renderPosts(posts) {
   if (!posts.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted">Không có bài viết</td>
      </tr>
    `;
    return;
  }
   
  tbody.innerHTML = posts.map(post => {
    const deletedStyle = post.isDeleted
      ? 'text-decoration: line-through; color: #999'
      : '';

    return `
      <tr>
        <td>${post.id}</td>
        <td style="${deletedStyle}">
          ${post.title}
          ${post.isDeleted ? '<span class="badge bg-secondary ms-2">Đã xóa mềm</span>' : ''}
        </td>

        
        <td>
          <div class="post-box">
            <div class="views">${post.views} lượt xem</div>
               <button class="btn btn-sm btn-secondary ms-1"
                  onclick="editPost('${post.id}')">Sửa</button>

            <div id="comments-${post.id}"></div>

            <div class="comment-input">
              <input class="form-control form-control-sm"
                     placeholder="Nhập bình luận..."
                     id="input-${post.id}">
              <button class="btn btn-sm btn-primary mt-1"
                      onclick="addComment('${post.id}')">
                Thêm bình luận
              </button>

              <button class="btn btn-sm btn-danger mt-1 ms-2"
                      onclick="softDeletePost('${post.id}')">
                Xóa bài viết mềm
              </button>
               <button class="btn btn-sm btn-danger mt-1 ms-2"
                      onclick="Delete('${post.id}')">
                Xóa bài viết
              </button>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  posts.forEach(post => loadComments(post.id));
}
function softDeletePost(postId) { 
  var options = {
    method : 'PATCH',
    headers : {
      'Content-Type' : 'application/json'
    },
      body: JSON.stringify({ isDeleted: true })
    
  }
  fetch(`${API_POSTS}/${postId}`, options)
  .then(function (response) {
    return response.json();
  })
  .then(function () {
      fetchPosts();
    })
}
function Delete(postId) { 
  var options = {
    method : 'DELETE',
    headers : {
      'Content-Type' : 'application/json'
    }
  }
  fetch(`${API_POSTS}/${postId}`, options)
  .then(function (response) {
    return response.json();
  })
  .then(function () {
      fetchPosts();
    })
}
function editPost(postId) {
  var newTitle = prompt('Nhập tiêu đề mới:');
  if (!newTitle) return;
  var options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: newTitle })
  };
  fetch(`${API_POSTS}/${postId}`, options)
  .then(function (response) {
    return response.json();
  })
  .then(function () {
    fetchPosts();
  });
}
function getNextId(arr) {
  let maxId = arr.reduce((max, item) => {
    let idNum = parseInt(item.id, 10);
    return (!isNaN(idNum) && idNum > max) ? idNum : max;
  }, 0);
  return String(maxId + 1);
}
function createPost() {
  var addBtn = document.getElementById('add-post');

  addBtn.onclick = function () {
    var title = prompt('Nhập tiêu đề post');
    if (!title) return;

    var views = prompt('Nhập số lượt xem');
    if (!views) return;

    fetch(API_POSTS)
      .then(function (response) {
        return response.json();
      })
      .then(function (posts) {
        const newPost = {
          id: getNextId(posts),
          title: title,
          views: parseInt(views, 10) || 0,
          isDeleted: false
        };

        var options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPost)
        };

        return fetch(API_POSTS, options);
      })
      .then(function () {
        fetchPosts();
        alert('Thêm post thành công!');
      });
  };
}


function addComment(postId) {
  const input = document.getElementById(`input-${postId}`);
  const text = input.value.trim();
  if (text === '') {
    alert('Vui lòng nhập nội dung bình luận.');
    return;
  }
  fetch(API_COMMENTS)
  .then (function (response) {
    return response.json();
  })
  .then(function (comments) {
    const newComment = {
      id: getNextId(comments),
      postId: postId,
      text: text, 
      isDeleted: false
    };
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newComment)
    };
    return fetch (API_COMMENTS, options);
  })
  .then(function () {
    input.value = '';
    loadComments(postId);
  })
}

function loadComments(postId) {
  fetch(`${API_COMMENTS}?postId=${postId}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (comments) {
    const commentsContainer = document.getElementById(`comments-${postId}`);
    if (comments.length === 0) {
      commentsContainer.innerHTML = '<div class="text-muted">Chưa có bình luận</div>';
      return;
    }
    commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment-item" style="${comment.isDeleted ? 'text-decoration:line-through;color:#999' : ''}">
          ${comment.text}
          <button class="btn btn-sm btn-danger ms-2"
                  onclick="deleteComment('${comment.id}', '${postId}')">Xóa</button>
          <button class="btn btn-sm btn-secondary ms-1"
                  onclick="editComment('${comment.id}', '${postId}')">Sửa</button>
        </div>
      `).join('');

  })
  .catch(function (error) {
    console.error('Error loading comments:', error);
  });
}



function editComment (commentId, postId) {
  var newText = prompt('Nhập nội dung mới');
  if (!newText) return;
  var options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
     body: JSON.stringify({
      text: newText
    })
  };

  fetch(`${API_COMMENTS}/${commentId}`, options)
  .then(function (response) {
    return response.json();
  })
  .then(function () {
    loadComments(postId);
  });
}
function deleteComment(commentId, postId) {
  var options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({ isDeleted: true })
  };
  fetch(`${API_COMMENTS}/${commentId}`, options)
  .then(function (response) {
    return response.json();
  })
  .then(function () {
    loadComments(postId);
  }); 
}