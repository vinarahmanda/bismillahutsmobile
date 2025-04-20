// Simulasi database sederhana dengan array
let comments = [];

export function getComments() {
  return comments;
}

export function addComment(comment) {
  comments.push(comment);
}
