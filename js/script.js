/*
{
    id: string | number,
    title: string,
    author: string,
    year: number,
    isComplete: boolean,
}*/
const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);

    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
});

//Fungsi menambahkan buku
function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

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

// <!--      <article class="book_item">-->
// <!--        <h3>Book Title</h3>-->
// <!--        <p>Penulis: John Doe</p>-->
// <!--        <p>Tahun: 2002</p>-->
// <!--    -->
// <!--        <div class="action">-->
// <!--          <button class="green">Selesai dibaca</button>-->
// <!--          <button class="red">Hapus buku</button>-->
// <!--        </div>-->
// <!--      </article>-->

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
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');

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

        checkButton.addEventListener('click', function () {
            addTaskToCompleted(bookObject.id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('action');
        actionButton.append(checkButton);

        container.append(actionButton);
    }

    return container;
}

function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}