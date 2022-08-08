  import $ from "./$.js";

  const removeElClickOut = (elToBeRemovedID, targetElID) => {
    document.addEventListener('click', (e) => {
      const isClickedInside = e.target.closest('#'+elToBeRemovedID)
      const element = $(elToBeRemovedID);
      if (!isClickedInside && element) $(targetElID).removeChild(element)
    })
  }

  export default removeElClickOut; 