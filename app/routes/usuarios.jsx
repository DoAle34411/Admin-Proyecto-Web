import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getSession } from "../utils/auth";
import Navbar from "../components/Navbar";

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return redirect("/login");
  
  // Fetch users data
  const response = await fetch(`${process.env.API_URL}/users`);
  const users = await response.json();
  return json({ users });
};

export default function Usuarios() {
  const { users } = useLoaderData();
  const [updating, setUpdating] = useState(false);

  const handleAdminStatusChange = async (userId, newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`${process.env.API_URL}/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">Email</th>
                <th className="px-6 py-3 border-b text-left">Nombre</th>
                <th className="px-6 py-3 border-b text-left">Tipo de Usuario</th>
                <th className="px-6 py-3 border-b text-center">Cambiar Rol</th>
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
                        user.isAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.isAdmin ? 'Administrador' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    <select
                      value={user.isAdmin ? 'admin' : 'regular'}
                      onChange={(e) => 
                        handleAdminStatusChange(
                          user._id, 
                          e.target.value === 'admin'
                        )
                      }
                      disabled={updating}
                      className="block w-40 mx-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="regular">Regular</option>
                      <option value="admin">Administrador</option>
                    </select>
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