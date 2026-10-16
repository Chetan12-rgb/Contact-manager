
"use client";

import { useEffect, useState } from "react";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
const [editingId, setEditingId] = useState<number | null>(null);
const [saving, setSaving] = useState(false);
const [deletingId, setDeletingId] = useState<number | null>(null);
const [success, setSuccess] = useState("");

async function handleDelete(id: number) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this contact?"
  );

  if (!confirmed) return;

  setError("");
  setSuccess("");
  setDeletingId(id);

  try {
    const response = await fetch(`${API_URL}/api/contacts/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete contact");
    }

    setContacts((currentContacts) =>
      currentContacts.filter((contact) => contact.id !== id)
    );
    setSuccess("Contact deleted successfully!");

    if (editingId === id) {
      setEditingId(null);
      setName("");
      setEmail("");
      setPhone("");
    }
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Failed to delete contact"
    );
  } finally {
    setDeletingId(null);
  }
}

  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetch(`${API_URL}/api/contacts`);

        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }

        const data: Contact[] = await response.json();
        setContacts(data);
      } catch (err) {
        console.error(err);
        setError("Could not load contacts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">Contact Manager</h1>
        <p className="mb-8 text-gray-600">
          Manage your contacts in one place.
        </p>

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
  {editingId !== null ? "Edit Contact" : "Add New Contact"}
</h2>

          <form
           

onSubmit={async (event) => {
  event.preventDefault();
  setError("");
  setSuccess("");
  setSaving(true);

  try {
    const isEditing = editingId !== null;

    const response = await fetch(
      isEditing
        ? `${API_URL}/api/contacts/${editingId}`
        : `${API_URL}/api/contacts`,
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save contact");
    }

    const contactsResponse = await fetch(`${API_URL}/api/contacts`);

    if (!contactsResponse.ok) {
      throw new Error("Contact saved, but failed to refresh the list");
    }

    const updatedContacts: Contact[] = await contactsResponse.json();
setContacts(updatedContacts);

setSuccess(
  isEditing
    ? "Contact updated successfully!"
    : "Contact added successfully!"
);

setName("");
setEmail("");
setPhone("");
setEditingId(null);
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Something went wrong"
    );
  } finally {
    setSaving(false);
  }
}}


            className="space-y-4"
          >
            {error && (
  <p role="alert" className="text-sm text-red-600">
    {error}
  </p>
)}

{success && (
  <p role="status" className="text-sm text-green-700">
    {success}
  </p>
)}
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter full name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email address"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            
<div className="flex gap-3">
  <button
    type="submit"
    disabled={saving}
    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
  >
    {saving
      ? "Saving..."
      : editingId !== null
        ? "Update Contact"
        : "Add Contact"}
  </button>

  {editingId !== null && (
    <button
      type="button"
      onClick={() => {
        setEditingId(null);
        setName("");
        setEmail("");
        setPhone("");
        setError("");
      }}
      className="rounded-lg border border-gray-300 px-5 py-2.5"
    >
      Cancel
    </button>
  )}
</div>

          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Your Contacts</h2>

          {loading && <p className="text-gray-500">Loading contacts...</p>}

          {!loading && !error && contacts.length === 0 && (
            <p className="text-gray-500">No contacts found.</p>
          )}

          {!loading && !error && contacts.length > 0 && (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <h3 className="font-semibold">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  <p className="text-sm text-gray-600">
                    {contact.phone || "No phone number"}
                  </p>

                
<button
  type="button"
  onClick={() => {
    setEditingId(contact.id);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone || "");
    setError("");
  }}
  className="mt-3 rounded-lg border border-blue-600 px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
>
  Edit
</button>


<button
  type="button"
  onClick={() => handleDelete(contact.id)}
  disabled={deletingId === contact.id}
  className="ml-2 rounded-lg border border-red-600 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
>
  {deletingId === contact.id ? "Deleting..." : "Delete"}
</button>


                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
