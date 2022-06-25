// TEMPLATE FOR ITEMS INSIDE THE SHOPPING LIST
class ListItem {
  name = '';
  date = '';
  position = 0;
  completed = false;
  elapsed = false
  id = '';
  constructor(name, date, position, completed = false, elapsed = false, id = null) {
    this.name = name;
    this.date = date;
    this.position = position;
    this.completed = completed;
    this.elapsed = elapsed;
    if (id) {
      this.id = id;
    } else {
      this.id = uniqueID();
    }
  }
}

// GET THE NAME OF THE CATEGORY LIST
function initListName(listElementData) {
  // FETCHING STRING FROM LOCAL STORAGE
  currentShoppingList = JSON.parse(localStorage.getItem('toDoLists') || "[]");
  // ITERRATION THROUGH LOCAL STORAGE ARRAY
  currentShoppingList.find(x => x.id === '${listElementData.id}')
}


let currentListId = '';
let currentCategoryItems = [];

init();

function init() {
  // PAGE IDENTIFICATION
  const urlObj = new URL(window.location.href);

  for (const [key, value] of urlObj.searchParams.entries()) {
    if (key === constants.listId) {
      currentListId = value;
    }
  }
  if (currentListId === '') {
    window.location.href = '/';
  }

  const lists = JSON.parse(localStorage.getItem(constants.listsListStorageName)) || [];
  const currentList = lists.find(item => item.id === currentListId);
  setTitle(currentList.name);

  if (!currentList) {
    window.location.href = '/';
  }

  // FETCHING TASKS FROM LOCAL STORAGE
  currentCategoryItems = JSON.parse(localStorage.getItem(`${constants.listPrefix}_${currentList.id}`) || "[]");

  // ITERRATION THROUGH LOCAL STORAGE ARRAY
  for (let index = 0; index < currentCategoryItems.length; index++) {
    addnewItem(currentCategoryItems[index]);
  }

}

function setTitle(title) {
  const titleElement = window.document.querySelector('#title');
  titleElement.textContent = title;
}

// BUILD CATEGORIES FOUND IN LOCAL STORAGE
function createElement(listElementData) {
  var ul = document.getElementsByClassName("items-style")[0];
  // CREATE CATEGORY, STYLE IT AND APPEND IT TO THE LIST
  var newItem = document.createElement('li');
  newItem.innerHTML =
    `<label class="control control--checkbox" for="checklist_${listElementData.id}">
          <span>${listElementData.name}</span>
          <input type="checkbox" id="checklist_${listElementData.id}">
          <div class="control__indicator"></div>
     </label>
     <span id="due-date">${listElementData.date}</span>
      <button class="remove-dark" onclick="delItem('${listElementData.id}')"></button>`;
  newItem.id = listElementData.id;
  // newItem.draggable = true;
  newItem.classList.add('incompleted');
  newItem.completed = listElementData.completed;
  newItem.elapsed = listElementData.elapsed;
  const completedToggle = newItem.querySelector('input[type=checkbox]');
  const disabledays = newItem.querySelector('.days');
  completedToggle.addEventListener('click', toggleDone(newItem, listElementData, completedToggle, disabledays));

  const expiryDate = newItem.querySelector('#due-date');
  daysCounter(newItem, expiryDate, listElementData);
 

  ul.insertBefore(newItem, ul.firstChild);
  newItem.style.display = "none";
  setTimeout(function () {
    newItem.style.display = "flex";
  }, 150);
}

//SAVE CURRENT LIST
function savecurrentCategoryItems() {
  localStorage.setItem(`${constants.listPrefix}_${currentListId}`, JSON.stringify(currentCategoryItems));
}

//CREATE NEW CATEGORY
function createNewItem() {
  var input = document.getElementById("userInput");
  var addDate = document.getElementById("add-date");
  let newItem = new ListItem(input.value, addDate.value, 1, false);
  currentCategoryItems.push(newItem);
  createElement(newItem);
  savecurrentCategoryItems()
  input.value = '';
  addDate.value = '';
}

// CHECK THE LENGTH OF THE INPUT FIELD
function getInputLength() {
  return document.getElementById("userInput").value.length;
}

// CHECK THE LENGTH OF THE INPUT FIELD
function getAddDateLength() {
  return document.getElementById("add-date").value.length;
}

// ADD NEW CATEGORY
function addnewItem(val) {
  var inputValue = val;
  createElement(inputValue);
}

// FIND CURRENT LIST NAME
function findListName(val) {
  var inputValue = val;
  createElement(inputValue);
}


// DELETE CATEGORY
function delItem(id) {
  // GET INDEX OF THE ITEMS
  var newItem = document.getElementById(id);
  const position = currentCategoryItems.findIndex(function (element) {
    return element.id === id;
  });

  if (position > -1) {
    currentCategoryItems.splice(position, 1);
    savecurrentCategoryItems();
    newItem.style.marginTop = "-50";
    newItem.style.opacity = "0";
  }
  setTimeout(function () {
    newItem.remove()
  }, 500);

}


// TOGGLE COMPLETE ON CLICK
function toggleDone(myItem, data, checkbox, disabledays) {
  if (data.completed === true) {
    checkbox.checked = 'true';
    myItem.classList.add('done');
    myItem.classList.add('completed');
    myItem.classList.remove('incompleted');
    disabledays.classList.add('unclickable');
  }
  return () => {
    myItem.classList.toggle('completed');
    myItem.classList.toggle('incompleted');
    myItem.classList.toggle('done');
    disabledays.classList.toggle('unclickable');
    data.completed = !data.completed;
    savecurrentCategoryItems();
  }
}

// ON CLICK
function addNewItem() {
  if (getInputLength() > 0 && getAddDateLength() > 0) {
    createNewItem();
  }
}

// ON KEYPRESS ENTER
function addItemKey(event) {
  if (getInputLength() > 0 && getAddDateLength() > 0 && event.keyCode == 13) {
    createNewItem();
  }
}



function daysCounter (el, expiryDate, listElementData) {

  const processedDate = new Date(listElementData.date).toLocaleDateString('en-us', { month:"short", day:"numeric", year:"numeric" });;
  console.log('listElementData.date', processedDate);

  // Set the date we're counting down to
  var countDownDate = new Date(processedDate + ' 23:59:59').getTime();
  
  console.log('countDownDate', countDownDate);
  // Update the count down every 1 second
  var x = setInterval(function() {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // If the count down is finished, write some text
    if (distance > 0 && days === 0) {
      if (el.classList.contains('elapsed')) {
        el.classList.remove('elapsed');
      }
      el.classList.add('due-to-expire');
    }
    if (distance < 0 || days < 0) {
      clearInterval(x);
      el.classList.add('elapsed');
      expiryDate.innerHTML = "overdue";
      listElementData.elapsed = true;
    }
  }, 1000);

  savecurrentCategoryItems();
}






// LISTSORTING
function filterList(radio) {
  var completeItems = document.getElementsByClassName("completed");
  var incompleteItems = document.getElementsByClassName("incompleted");
  if (radio.value == "completed") {
    Array.from(incompleteItems).forEach(function (el) {
      el.style.display = 'none';
    });
    Array.from(completeItems).forEach(function (el) {
      el.style.display = 'flex';
    });
  } else if (radio.value == "incompleted") {
    Array.from(completeItems).forEach(function (el) {
      el.style.display = 'none';
    });
    Array.from(incompleteItems).forEach(function (el) {
      el.style.display = 'flex';
    });
  } else {
    Array.from(completeItems).forEach(function (el) {
      el.style.display = 'flex';
    });
    Array.from(incompleteItems).forEach(function (el) {
      el.style.display = 'flex';
    });
  }
}




