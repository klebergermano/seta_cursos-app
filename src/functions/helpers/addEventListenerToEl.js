const addEventListenerToEl = (el) => (event) => (callback) => {
    el.addEventListener(event, callback)
  }
  
  export default addEventListenerToEl; 