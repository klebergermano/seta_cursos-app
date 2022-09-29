const maxOrMinimizeEl = (el, scrolledElement) => {
    const maxHeight = window.innerHeight;

    function setDataPrevWidhtHeightEl(el) {
      el.setAttribute('data-prev_width', `${el.offsetWidth}px`);
      el.setAttribute('data-prev_height', `${el.offsetHeight}px`);
    }

    if (!el.dataset?.prev_width || !el.dataset?.prev_height) setDataPrevWidhtHeightEl(el)

    if (!el.classList.contains('el_maximized')) {
      el.classList.add('el_maximized');
      el.style.left = '0';
      el.style.top = scrolledElement.scrollTop + 'px';
      el.style.width = '100%';
      el.style.height = maxHeight + 'px';
    } else {
      el.classList.remove('el_maximized')
      el.style.width = el.dataset.prev_width;
      el.style.height = el.dataset.prev_height;
    }
  }

  export default maxOrMinimizeEl;