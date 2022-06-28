// TEMPLATE FOR SHOPPING LIST
class toDoList {
  name = '';
  id = '';
  constructor(name, id = null) {
    this.name = name;
    if (id) {
      this.id = id;
    } else {
      this.id = uniqueID();
    }
  }
}

let currentItems;
init();

function init() {
  // FETCHING STRING FROM LOCAL STORAGE
  currentItems = JSON.parse(localStorage.getItem(constants.listsListStorageName) || "[]");
  // ITERRATION THROUGH LOCAL STORAGE ARRAY
  for (let index = 0; index < currentItems.length; index++) {
    addNewCategory(currentItems[index]);
  }
}

// BUILD CATEGORIES FOUND IN LOCAL STORAGE
function createElement(listElementData, index) {
  var ul = document.getElementsByClassName("categories-style")[0];
      // CREATE CATEGORY, STYLE IT AND APPEND IT TO THE LIST
  var li = document.createElement('li');
  li.innerHTML =
    `<a href="category.html?${constants.listId}=${listElementData.id}"><img src="./img/reorder_icon.svg" alt="reorder">  
      <span id="categ">${listElementData.name}</span></a><button class="remove-dark" onclick="delItem('${listElementData.id}')"></button>`;
  li.id = listElementData.id;
  li.setAttribute('data-index', "");
  ul.insertBefore(li, ul.firstChild);
  li.style.opacity = "0";
    setTimeout(function(){
        li.style.opacity = "1";
    }, 150);
}

//SAVE CURRENT LIST
function saveCurrentItems() {
  window.localStorage.setItem(constants.listsListStorageName, JSON.stringify(currentItems));
}

//CREATE NEW CATEGORY
function createNewCategory() {
  var input = document.getElementById("userInput");
  let newCategory = new toDoList(input.value);
  currentItems.push(newCategory);
  createElement(newCategory);
  saveCurrentItems()
  input.value ='';
}

// CHECK THE LENGTH OF THE INPUT FIELD
function getInputLength() {
  return document.getElementById("userInput").value.length;
}

 
// ADD NEW CATEGORY
 function addNewCategory(val) {
  var inputValue = val;
  createElement(inputValue);
 }


// DELETE CATEGORY
function delItem(id) {
  // GET INDEX OF THE ITEMS
  var li = document.getElementById(id);
  const position = currentItems.findIndex( function(element) {
   // console.log(element.id, typeof element.id);
    return element.id === id;
  });
  if (position > -1) {
    currentItems.splice(position, 1);
    saveCurrentItems();
    li.style.marginTop = "-50"; 
    li.style.opacity = "0";
  } 
    setTimeout(function(){
      li.remove()
  }, 500);
 
}



// ON CLICK
function addClick() {
  if (getInputLength() > 0) {
    createNewCategory();
  }
}

// ON KEYPRESS ENTER
function addKey(event) {
  if (getInputLength() > 0 && event.keyCode == 13) {
    createNewCategory();
  }

}
