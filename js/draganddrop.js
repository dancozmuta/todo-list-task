function sortList (target) {
  // GET ALL LIST ITEMS
  target.classList.add("sortlist");
  let items = target.getElementsByTagName("li"), current = null;
  var draggedElements = [];
  const fromItems = Array.from(items);

  // MAKE ITEMS DRAGGABLE + SORTABLE
  for (let i of items) {
    // (B1) ATTACH DRAGGABLE
    i.draggable = true;
    
    // DRAG START - YELLOW HIGHLIGHT DROPZONES
    i.ondragstart = (ev) => {
      current = i;
      for (let it of items) {
        if (it != current) { it.classList.add("hint"); }
      }
    
      draggedElements = fromItems.splice(current, 1);
    };
    
    // DRAG ENTER - RED HIGHLIGHT DROPZONE
    i.ondragenter = (ev) => {
      if (i != current) { i.classList.add("active"); }
    };

    // DRAG LEAVE - REMOVE RED HIGHLIGHT
    i.ondragleave = () => {
      i.classList.remove("active");
    };

    // DRAG END - REMOVE ALL HIGHLIGHTS
    i.ondragend = () => { for (let it of items) {
        it.classList.remove("hint");
        it.classList.remove("active");
    }};
 
    // DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
    i.ondragover = (evt) => { evt.preventDefault(); };
 
    // ON DROP - DO SOMETHING
    i.ondrop = (evt) => {
      evt.preventDefault();
      let currentpos = 0, droppedpos = 0;
      if (i != current) {   
        for (let it=0; it<items.length; it++) {
          if (current == items[it]) { currentpos = it; }
          if (i == items[it]) { droppedpos = it; }
        }
        if (currentpos < droppedpos) {
          i.parentNode.insertBefore(current, i.nextSibling);
        } else {
          i.parentNode.insertBefore(current, i);
        }
      }

      

      const newItems = document.querySelectorAll("[draggable='true']");

      // create array of id of new items
      const newItemsId = [];
      for (let it of newItems) {
        newItemsId.push(it.id);
      }
      
      // reorder currentCategoryItems based on newItemsId
      const newCategoryItems = [];
      const newLists = [];

      if (!currentCategoryItems) { 
        for (let it of newItemsId) {
          const position = currentLists.findIndex(function (element) {
            return element.id === it;
          });
          newLists.push(currentLists[position]);
        }

        // reverse order of currentCategoryItems
        currentLists = newLists.reverse();

        savecurrentLists();

      } else {
        for (let it of newItemsId) {
          const position = currentCategoryItems.findIndex(function (element) {
            return element.id === it;
          });
          newCategoryItems.push(currentCategoryItems[position]);
        }
  
        // reverse order of currentCategoryItems
        currentCategoryItems = newCategoryItems.reverse();
  
        savecurrentCategoryItems();
      }
    };  
  }
}