// TEMPLATE FOR ITEMS INSIDE THE SHOPPING LIST
class ListItem {
  name = '';
  days = 0;
  position = 0;
  completed = false;
  elapsed = false
  id = '';
  constructor(name, days, position, completed = false, elapsed = false, id = null) {
    this.name = name;
    this.days = days;
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
    <div class="days">
        <button id="minus"  onclick="countDays(this, 'minus', '${listElementData.id}')"></button>
        <input type="number" id="count" class="text-center " min="0" name="days" value="${listElementData.days}">
        <span>days</span>
        <button id="plus"  onclick="countDays(this, 'plus', '${listElementData.id}')"></button>
    </div>
      <button class="remove-dark" onclick="delItem('${listElementData.id}')"></button>`;
  newItem.id = listElementData.id;
  // newItem.draggable = true;
  newItem.classList.add('incompleted');
  newItem.completed = listElementData.completed;
  newItem.elapsed = listElementData.elapsed;
  const days = newItem.querySelector('input[type=number]');
  days.value = listElementData.days;
  const completedToggle = newItem.querySelector('input[type=checkbox]');
  const disabledays = newItem.querySelector('.days');
  completedToggle.addEventListener('click', toggleDone(newItem, listElementData, completedToggle, disabledays));

  const decreaseSign = newItem.querySelector('#minus');
  const daysNumber = newItem.querySelector('#count');
  daysNumber.addEventListener('input', toggleElapsed(newItem, listElementData, decreaseSign, daysNumber));


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
  let newItem = new ListItem(input.value, 1, false);
  currentCategoryItems.push(newItem);
  createElement(newItem);
  savecurrentCategoryItems()
  input.value = '';
}

// CHECK THE LENGTH OF THE INPUT FIELD
function getInputLength() {
  return document.getElementById("userInput").value.length;
}


// ADD NEW CATEGORY
function addnewItem(val) {
  var inputValue = val;
  createElement(inputValue);
  sortList(document.querySelector('.items-style'));
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
  if (getInputLength() > 0) {
    createNewItem();
  }
}

// ON KEYPRESS ENTER
function addItemKey(event) {
  if (getInputLength() > 0 && event.keyCode == 13) {
    createNewItem();
  }
}


// ELAPSED DAYS CHECK

function toggleElapsed(newItem, data, decreaseSign, daysNumber) {
  console.log('item inside elapsed function', daysNumber.value);
  if (daysNumber.value < 1) {
    newItem.classList.add('elapsed');
    decreaseSign.classList.add('disabled');
    data.elapsed = true;
    console.log('!!!! days are 0', newItem, data);
  } else {
    console.log('days are not 0');
    data.elapsed = false;
    newItem.classList.remove('elapsed');
    decreaseSign.classList.remove('disabled');
  }
}


// DAYS COUNTER

function countDays(el, data, identifiedItem) {

  var item = currentCategoryItems.find(function (it) {
    return it.id === identifiedItem;
  });
  var input = el.parentNode.querySelector('input[type=number]');


  var decreaseSign = el.parentNode.querySelector('#minus');
  var listItem = el.parentElement.parentElement;

  item.days = Math.max(0, item.days);

  if (data === 'plus') {
    if (decreaseSign.classList.contains('disabled') && item.elapsed) {
      decreaseSign.classList.remove('disabled');
      listItem.classList.remove('elapsed');
      item.elapsed = !item.elapsed;
      console.log('item after', item.elapsed);
    }
    item.days++;
    input.stepUp();
  } if (data === 'minus' ) {
      item.days--;
      if (item.days === 0) {
        console.log('reached 0');
        decreaseSign.classList.add('disabled');
        listItem.classList.add('elapsed');
        item.elapsed = true;
        console.log('item after', item.elapsed);
      }
      input.stepDown();
  }

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