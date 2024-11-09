import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getSession } from "../utils/auth";
import Navbar from "../components/Navbar";

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return redirect("/login");
  
  // Fetch books data
  const response = await fetch(`${process.env.API_URL}/books`);
  const books = await response.json();
  return json({ books });
};

export default function Libros() {
  const { books } = useLoaderData();

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

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Libros</h1>
          <Link to="/bookForm" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Agregar Libro</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">Nombre</th>
                <th className="px-6 py-3 border-b text-left">Editorial</th>
                <th className="px-6 py-3 border-b text-left">Autor</th>
                <th className="px-6 py-3 border-b text-left">Género</th>
                <th className="px-6 py-3 border-b text-left">Disponibles</th>
                <th className="px-6 py-3 border-b text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{book.name}</td>
                  <td className="px-6 py-4 border-b">{book.editorial}</td>
                  <td className="px-6 py-4 border-b">{book.author}</td>
                  <td className="px-6 py-4 border-b">{book.genre}</td>
                  <td className="px-6 py-4 border-b">{book.amountAvailable}</td>
                  <td className="px-6 py-4 border-b text-center">
                    <div className="flex justify-center space-x-2">
                    <Link to={`/bookFormEdit/${book._id}`}  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md">Editar</Link>
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
      </div>
    </div>
  );
}