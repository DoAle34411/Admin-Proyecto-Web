import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getSession } from "../utils/auth";
import Navbar from "../components/Navbar";

export const loader = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return redirect("/login");
  
  // Only try to fetch the book if we have an ID parameter
  if (params.id) {
    try {
      const response = await fetch(`https://api-express-web.onrender.com/books/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch book');
      }
      const book = await response.json();
      return json({ book });
    } catch (error) {
      console.error('Error fetching book:', error);
      return json({ error: 'Failed to load book' }, { status: 500 });
    }
  }
  
  return json({ book: null });
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const bookData = Object.fromEntries(formData);
  
  try {
    const response = await fetch(`https://api-express-web.onrender.com/books/update/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      throw new Error('Failed to update book');
    }
  } catch (error) {
    console.error('Error updating book:', error);
    return json({ error: 'Failed to update book' }, { status: 500 });
  }
  
  return redirect('/libros');
};

export default function BookForm() {
  const { book } = useLoaderData();
  const isEditing = !!book;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Editar Libro' : 'Nuevo Libro'}
        </h1>
        
        <Form method="post" className="max-w-2xl space-y-4">
          {/* Rest of your form fields remain the same */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              defaultValue={book?.name || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Editorial</label>
            <input
              type="text"
              name="editorial"
              defaultValue={book?.editorial || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Edición</label>
            <input
              type="text"
              name="edition"
              defaultValue={book?.edition || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Autor</label>
            <input
              type="text"
              name="author"
              defaultValue={book?.author || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Género</label>
            <input
              type="text"
              name="genre"
              defaultValue={book?.genre || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Páginas</label>
            <input
              type="number"
              name="pages"
              defaultValue={book?.pages || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad Total</label>
            <input
              type="number"
              name="amountTotal"
              defaultValue={book?.amountTotal || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad Disponible</label>
            <input
              type="number"
              name="amountAvailable"
              defaultValue={book?.amountAvailable || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Sinopsis</label>
            <textarea
              name="synopsis"
              defaultValue={book?.synopsis || ''}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <input
              type="text"
              name="status"
              defaultValue={book?.status || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Fix the name to 'imageUrl' to match the backend model */}
          <div>
            <label className="block text-sm font-medium text-gray-700">URL Portada</label>
            <input
              type="text"
              name="imageUrl" // Change this name to 'imageUrl' to match the backend model
              defaultValue={book?.imageUrl || ''} // Use 'imageUrl' from the book data
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
