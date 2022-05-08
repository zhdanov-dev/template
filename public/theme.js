const btn = document.querySelector('.btn-toggle');
document.querySelector('.theme__icon').addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-toggle')) {
    document.querySelectorAll(".material-symbols-outlined").forEach((e) => {
      e.classList.toggle('hidden')
    });
  }
  document.body.classList.toggle('theme-dark');
})