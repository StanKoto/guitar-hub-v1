import { setupSorting } from '../modules/helpers.js';

setupSorting('rating-asc', 'rating');
setupSorting('rating-desc', '-rating');
if (document.getElementById('reviewer-asc')) {
  setupSorting('reviewer-asc', 'reviewer');
  setupSorting('reviewer-desc', '-reviewer');
} else {
  setupSorting('recipient-asc', 'recipient');
  setupSorting('recipient-desc', '-recipient');
}
setupSorting('created-asc', 'createdAt');
setupSorting('created-desc', '-createdAt');