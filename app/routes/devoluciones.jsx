import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getSession } from "../utils/auth";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return redirect("/login");
  
  // Fetch rent data
  const response = await fetch('https://api-express-web.onrender.com/rent/rents');
  const rents = await response.json();
  
  // Fetch user names for each rent
  const users = {};
  for (const rent of rents) {
    if (!users[rent.user_id]) {
      const userResponse = await fetch(`https://api-express-web.onrender.com/users/id/${rent.user_id}`);
      const user = await userResponse.json();
      users[rent.user_id] = user.name; // Store user name by user_id
    }
  }

  return json({ rents, users });
};

export default function Rents() {
  const { rents, users } = useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'returned'
  const itemsPerPage = 20;

  // Pagination state
  const totalPages = Math.ceil(rents.length / itemsPerPage);
  const currentRents = rents
    .filter((rent) => {
      if (filter === 'pending') {
        return rent.return_date === null;
      } else if (filter === 'returned') {
        return rent.return_date !== null;
      }
      return true; // 'all' filter shows all rents
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleReturn = async (rentId) => {
    if (!confirm("¿Estás seguro de que quieres devolver este libro?")) return;
    try {
      await fetch(`https://api-express-web.onrender.com/rent/rents/${rentId}`, {
        method: 'PUT',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error returning rent:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Rentas</h1>
          <div>
            <label htmlFor="filter" className="mr-2">Filtrar por:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border rounded-md"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="returned">Devueltos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">Usuario</th>
                <th className="px-6 py-3 border-b text-left">Libros</th>
                <th className="px-6 py-3 border-b text-left">Cantidad Rentada</th>
                <th className="px-6 py-3 border-b text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRents.map((rent) => (
                <tr key={rent._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">
                    {users[rent.user_id] || 'Cargando...'}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <ul>
                      {rent.books.map((book) => (
                        <li key={book.id_Book.name}>Nombre: {book.id_Book.name}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <ul>
                      {rent.books.map((book) => (
                        <li key={book.bookId}>Cantidad: {book.amount_rented}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    {rent.return_date === null && (
                      <button
                        onClick={() => handleReturn(rent.rent_id)}
                        style={{
                          backgroundColor: '#38A169', // Tailwind green-500
                          color: 'white',
                          padding: '0.5rem 1.5rem',
                          borderRadius: '0.375rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease-in-out',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
