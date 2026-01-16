"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch vehicles from Supabase
  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) console.error(error);
    else setVehicles(data);
    setLoading(false);
    console.log({ data, error });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Delete a vehicle row
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this vehicle?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id);

    if (error) console.error(error);
    else fetchVehicles(); // refresh list
  };

  // Edit a vehicle row
  const handleEdit = async (vehicle) => {
    const newDriverNumber = prompt(
      "Enter new Driver Number:",
      vehicle.driver_number
    );
    if (!newDriverNumber) return;

    const { error } = await supabase
      .from("vehicles")
      .update({ driver_number: newDriverNumber })
      .eq("id", vehicle.id);

    if (error) console.error(error);
    else fetchVehicles(); // refresh list
  };

  // Filter vehicles based on search input
  const filteredVehicles = vehicles.filter((v) =>
    v.driver_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Vehicle Entries
        </h1>

        {/* Search Input */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by Driver Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 
            text-gray-900 placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:outline-none"          />
          <button
            onClick={() => fetchVehicles()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredVehicles.length === 0 ? (
          <p className="text-gray-500">No vehicle entries found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                    Vehicle No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                    Driver No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                    Bill Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                    Bill Photo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                    Vehicle Photo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="border-t">
                    <td className="px-4 py-3 text-gray-700">{v.vehicle_number}</td>
                    <td className="px-4 py-3 text-gray-700">{v.driver_number}</td>
                    <td className="px-4 py-3 text-gray-700">₹{v.bill_amount}</td>

                    <td className="px-4 py-3">
                      <img
                        src={v.bill_photo_url}
                        alt="Bill"
                        className="h-16 w-16 object-cover rounded-lg border"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <img
                        src={v.vehicle_photo_url}
                        alt="Vehicle"
                        className="h-16 w-16 object-cover rounded-lg border"
                      />
                    </td>

                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(v)}
                        className="px-2 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
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
