// TEMPLATE FOR ITEMS INSIDE THE SHOPPING LIST
class ListItem {
  name = '';
  date = '';
  position = 1;
  done = false;
  elapsed = false
  id = '';
  constructor(name, date, position, done = false, elapsed = false, id = null) {
    this.name = name;
    this.date = date;
    this.position = position;
    this.done = done;
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

  console.log('currentCategoryItems', currentCategoryItems);

  // ITERRATION THROUGH LOCAL STORAGE ARRAY
  for (let index = 0; index < currentCategoryItems.length; index++) {
    setPosition(index);
    addnewItem(currentCategoryItems[index]);
  }
}

function setTitle(title) {
  const titleElement = window.document.querySelector('#title');
  titleElement.textContent = title;
}

function setPosition(index) {
  currentCategoryItems[index].position = index + 1;
}

// BUILD CATEGORIES FOUND IN LOCAL STORAGE
function createElement(listElementData) {
  var ul = document.getElementsByClassName("items-style")[0];

  // CREATE TASK, STYLE IT AND APPEND IT TO THE LIST
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
  newItem.classList.add('pending');
  newItem.done = listElementData.done;
  newItem.elapsed = listElementData.elapsed;
  const doneToggle = newItem.querySelector('input[type=checkbox]');
  doneToggle.addEventListener('click', toggleDone(newItem, listElementData, doneToggle));

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
  currentCategoryItems = sortOverdueTasks(currentCategoryItems, e => e.elapsed === true);
  localStorage.setItem(`${constants.listPrefix}_${currentListId}`, JSON.stringify(currentCategoryItems));
}

//CREATE NEW CATEGORY
function createNewItem() {
  var input = document.getElementById("userInput");
  var addDate = document.getElementById("add-date");
  let newItem = new ListItem(input.value, addDate.value, 1, false);
  currentCategoryItems.push(newItem);
  createElement(newItem);

  // ITERRATION THROUGH LOCAL STORAGE ARRAY
  for (let index = 0; index < currentCategoryItems.length; index++) {
    setPosition(index);
  }

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
function toggleDone(myItem, data, checkbox) {
  if (data.done === true) {
    checkbox.checked = 'true';
    myItem.classList.add('done');
    myItem.classList.remove('pending');
  }
  return () => {
    myItem.classList.toggle('done');
    myItem.classList.toggle('pending');
    data.done = !data.done;
    savecurrentCategoryItems();
  }
}

// ON CLICK
function addNewItem() {
  if (getInputLength() > 0 && getAddDateLength() > 0) {
    createNewItem();
    document.location.reload(true);
  }
}

// ON KEYPRESS ENTER
function addItemKey(event) {
  if (getInputLength() > 0 && getAddDateLength() > 0 && event.keyCode == 13) {
    createNewItem();
    document.location.reload(true);
  }
}



function daysCounter(el, expiryDate, listElementData) {

  const processedDate = new Date(listElementData.date).toLocaleDateString('en-us', {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // Set the date we're counting down to
  var countDownDate = new Date(processedDate + ' 23:59:59').getTime();

  // Update the count down every 1 second
  var x = setInterval(function () {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

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


// SORT OVERDUE TASKS AND PLACE THEM AT THE TOP

function sortOverdueTasks(currentCategoryItems, fn) {
  var non_matches = [];
  var matches = currentCategoryItems.filter(function (e, i, currentCategoryItems) {
    var match = fn(e, i, currentCategoryItems);
    if (!match) non_matches.push(e);
    return match;
  });

  return non_matches.concat(matches);
}


// LISTSORTING

function filterList(radio) {
  var doneItems = document.getElementsByClassName("done");
  var pendingItems = document.getElementsByClassName("pending");
  var elapsedItems = document.getElementsByClassName("elapsed");
  if (radio.value == "done") {
    Array.from(pendingItems).forEach(function (el) {
      el.style.display = 'none';
    });
    Array.from(doneItems).forEach(function (el) {
      el.style.display = 'flex';
    });
  } else if (radio.value == "pending") {
    Array.from(doneItems).forEach(function (el) {
      el.style.display = 'none';
    });
    Array.from(pendingItems).forEach(function (el) {
      el.style.display = 'flex';
    });
  } else if (radio.value == "elapsed") {
    Array.from(doneItems).forEach(function (el) {
      el.style.display = 'none';
    });
    Array.from(pendingItems).forEach(function (el) {
      el.style.display = 'none';
    });
    Array.from(elapsedItems).forEach(function (el) {
      el.style.display = 'flex';
    });
  } else {
    Array.from(doneItems).forEach(function (el) {
      el.style.display = 'flex';
    });
    Array.from(pendingItems).forEach(function (el) {
      el.style.display = 'flex';
    });
  }
}