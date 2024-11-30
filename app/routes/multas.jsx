import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getSession } from "../utils/auth";
import Navbar from "../components/Navbar";

export const loader = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.has("userId")) return redirect("/login");
  
    try {
      // Fetch all users from the existing endpoint
      const response = await fetch('https://api-express-web.onrender.com/users/admin/allUsers');
      if (!response.ok) {
        throw new Error('Failed to fetch all users');
      }
      const users = await response.json();
  
      // Filter users who have a multa greater than 0
      const usersWithMultas = users.filter(user => user.multa > 0);
  
      return json({ users: usersWithMultas });
    } catch (error) {
      console.error('Error fetching users with multas:', error);
      return json({ error: 'Failed to load users with multas', users: [] }, { status: 500 });
    }
  };

  export default function Multas() {
    const { users, error } = useLoaderData();
    const [updating, setUpdating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleClearMulta = async (userId) => {
      setUpdating(true);
      setErrorMessage('');
  
      try {
        const response = await fetch(`https://api-express-web.onrender.com/users/admin/clear-multa/${userId}`, {
          method: 'POST',
        });
  
        if (!response.ok) {
          throw new Error('Failed to clear multa');
        }
  
        // Reload the page to reflect changes
        window.location.reload();
      } catch (error) {
        console.error('Error clearing multa:', error);
        setErrorMessage('Error clearing multa. Please try again.');
      } finally {
        setUpdating(false);
      }
    };
  
    if (error) {
      return (
        <div>
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios con Multas</h1>
  
          {errorMessage && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{errorMessage}</p>
            </div>
          )}
  
          {/* Show message if no users with multas */}
          {users.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>No existen multas actuales.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 border-b text-left">Email</th>
                    <th className="px-6 py-3 border-b text-left">Nombre</th>
                    <th className="px-6 py-3 border-b text-left">Multa</th>
                    <th className="px-6 py-3 border-b text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 border-b">{user.email}</td>
                      <td className="px-6 py-4 border-b">{user.name}</td>
                      <td className="px-6 py-4 border-b">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.multa
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.multa ? `Multa: $${user.multa}` : 'No tiene multa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {user.multa > 0 && (
                          <button
                            onClick={() => handleClearMulta(user._id)}
                            disabled={updating}
                            className={`px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 
                              ${updating ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'}
                            `}
                          >
                            {updating ? 'Cargando...' : 'Pagar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
  