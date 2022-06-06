//array kosong buku
const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);

    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = "";

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted)
            uncompletedBOOKList.append(bookElement);
        else
            completedBOOKList.append(bookElement);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    //cek storage
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

//Fungsi menambahkan buku
function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const readStatus = document.getElementById('inputBookIsComplete').checked;

    if (readStatus != readStatus.checked) {
        isCompleted = false;
    }

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, readStatus);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

//Fs generate id
function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

//fungsi menambahkan buku
function makeBook(bookObject) {
    const textTittle = document.createElement('h3');
    textTittle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTittle, textAuthor, textYear);
    container.setAttribute('id', `book-${bookObject.id}`);


    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerHTML = "Belum Selesai dibaca";

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerHTML = "Hapus buku";

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(bookObject.id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('action');
        actionButton.append(undoButton, trashButton);

        container.append(actionButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerHTML = "Selesai dibaca";

        checkButton.addEventListener('click', function () {
            addTaskToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerHTML = "Hapus buku";

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(bookObject.id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('action');
        actionButton.append(checkButton, trashButton);

        container.append(actionButton);
    }

    return container;
}

function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

//fs untuk menyimpan data ke lokal storage dr array ke json 
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

//fs cek storage broswer
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));

    //clear input form
    const inputBookTitle = document.getElementById('inputBookTitle');
    inputBookTitle.value = "";

    const inputBookAuthor = document.getElementById('inputBookAuthor');
    inputBookAuthor.value = "";

    const inputBookYear = document.getElementById('inputBookYear');
    inputBookYear.value = "";

    const inputBookIsComplete = document.getElementById('inputBookIsComplete');
    inputBookIsComplete.checked = false;

});

//fungsi ekstrak json ke array
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

//fungsi search
const searchSubmit = document.getElementById('searchSubmit');
searchSubmit.addEventListener('click', function (event) {
    event.preventDefault();
    searchByTitle();
});

function searchByTitle() {
    const searchBookTitle = document.querySelector('#searchBookTitle').value.toLowerCase();
    const bookItem = document.querySelectorAll('.book_item');

    bookItem.forEach((item) => {
        const isiItem = item.firstChild.textContent.toLowerCase();

        if (isiItem.indexOf(searchBookTitle) != -1) {
            item.setAttribute('style', 'display: block;');
        } else {
            item.setAttribute('style', 'display: none !important;');
        }
    });

}