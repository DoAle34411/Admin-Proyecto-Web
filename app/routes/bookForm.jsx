import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getSession } from "../utils/auth";
import Navbar from "../components/Navbar";

export const loader = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return redirect("/login");
  
  let book = null;
  if (params.id) {
    const response = await fetch(`${process.env.API_URL}/books/${params.id}`);
    book = await response.json();
  }
  
  return json({ book });
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const bookData = Object.fromEntries(formData);
  
  const url = params.id 
    ? `${process.env.API_URL}/books/update/${params.id}`
    : `${process.env.API_URL}/books/createBook`;

    console.log(url);
    
  const method = params.id ? 'PUT' : 'POST';
  
  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });
  
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              defaultValue={book?.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Editorial</label>
            <input
              type="text"
              name="editorial"
              defaultValue={book?.editorial}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Edición</label>
            <input
              type="text"
              name="edition"
              defaultValue={book?.edition}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Autor</label>
            <input
              type="text"
              name="author"
              defaultValue={book?.author}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Género</label>
            <input
              type="text"
              name="genre"
              defaultValue={book?.genre}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Páginas</label>
            <input
              type="number"
              name="pages"
              defaultValue={book?.pages}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad Total</label>
            <input
              type="number"
              name="amountTotal"
              defaultValue={book?.amountTotal}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad Disponible</label>
            <input
              type="number"
              name="amountAvailable"
              defaultValue={book?.amountAvailable}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Sinopsis</label>
            <textarea
              name="synopsis"
              defaultValue={book?.synopsis}
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
              defaultValue={book?.genre}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
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