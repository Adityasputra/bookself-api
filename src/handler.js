const { nanoid } = require('nanoid');
const books = require('./books');

// Handler untuk menambahkan buku baru
const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Membuat Id
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // Membuat Objek buku baru
  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // push ke array books
  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(400);
  return response;
};

// Handler untuk mendapatkan semua buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBook = books;

  if (name !== undefined) {
    filteredBook = filteredBook.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  if (reading !== undefined) {
    const isReading = reading === '1';

    filteredBook = filteredBook.filter(
      (book) => book.reading === isReading,
    );
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';

    filteredBook = filteredBook.filter(
      (book) => book.finished === isFinished,
    );
  }

  // Mapping hasil dari filterBook
  const result = filteredBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: result,
    },
  });
  response.code(200);
  return response;
};

// Handler untuk mendapat buku berdasarkan Id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((getBook) => getBook.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Handler untuk mengedit buku berdasarkan Id
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Mencari Id buku untuk diubah
  const findIndexBooks = books.findIndex((book) => book.id === bookId);
  const finished = pageCount === readPage;

  if (findIndexBooks !== -1) {
    books[findIndexBooks] = {
      ...books[findIndexBooks],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Handler untuk menghapus buku berdasarkan Id
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const findIndexBook = books.findIndex((book) => book.id === bookId);

  if (findIndexBook !== -1) {
    books.splice(findIndexBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
