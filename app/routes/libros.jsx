import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getSession } from "../utils/auth";
import Navbar from "../components/Navbar";
import { useState } from "react";

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return redirect("/login");
  
  // Fetch books data
  const response = await fetch('https://api-express-web.onrender.com/books');
  const books = await response.json();
  return json({ books });
};

export default function Libros() {
  const { books } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortedBooks, setSortedBooks] = useState(books);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...sortedBooks].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setSortedBooks(sorted);
  };

  // Filter books by title and genre
  const filteredBooks = sortedBooks.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedGenre ? book.genre === selectedGenre : true)
  );

  // Paginate the filtered books
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const currentBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este libro?")) return;
    try {
      await fetch(`https://api-express-web.onrender.com/books/delete/${id}`, {
        method: 'DELETE',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // Fetch distinct genres for filtering
  const genres = Array.from(new Set(books.map(book => book.genre)));

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Libros</h1>
          <Link to="/bookForm" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Agregar Libro</Link>
        </div>

        <div className="flex mb-6">
          <input
            type="text"
            className="border p-2 mr-4"
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border p-2"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Todos los géneros</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">
                  <button onClick={() => handleSort('name')}>
                    Nombre {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </button>
                </th>
                <th className="px-6 py-3 border-b text-left">
                  Editorial
                </th>
                <th className="px-6 py-3 border-b text-left">
                  Autor
                </th>
                <th className="px-6 py-3 border-b text-left">
                  Género
                </th>
                <th className="px-6 py-3 border-b text-left">
                  Disponibles
                </th>
                <th className="px-6 py-3 border-b text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{book.name}</td>
                  <td className="px-6 py-4 border-b">{book.editorial}</td>
                  <td className="px-6 py-4 border-b">{book.author}</td>
                  <td className="px-6 py-4 border-b">{book.genre}</td>
                  <td className="px-6 py-4 border-b">{book.amountAvailable}</td>
                  <td className="px-6 py-4 border-b text-center">
                    <div className="flex justify-center space-x-2">
                      <Link to={`/bookFormEdit/${book._id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md">Editar</Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
