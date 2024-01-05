import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-73849-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addBtnEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addBtnEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue)
    clearInputFieldEl()
    console.log(`${inputValue} added to database.`)
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {

        let shoppingListArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        for (let i = 0; i < shoppingListArray.length; i++) {
            let currentListItem = shoppingListArray[i]
            let currentListItemID = currentListItem[0]
            let currentListItemValue = currentListItem[1]
            
            appendItemToShoppingListEl(currentListItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet."
    }
})

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}