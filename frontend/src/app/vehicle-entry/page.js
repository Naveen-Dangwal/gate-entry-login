"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function VehicleEntryForm() {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    driverNumber: "",
    billAmount: "",
    billPhoto: null,
    vehiclePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Upload Bill Photo
const billExt = formData.billPhoto.name.split(".").pop();
const billFileName = `bill-${Date.now()}.${billExt}`;

const { error: billError } = await supabase.storage
  .from("vehicle-photos")
  .upload(billFileName, formData.billPhoto);

if (billError) {
  console.error("Bill upload error:", billError);
  return;
}

const billPhotoUrl = supabase.storage
  .from("vehicle-photos")
  .getPublicUrl(billFileName).data.publicUrl;

// Upload Vehicle Photo
const vehicleExt = formData.vehiclePhoto.name.split(".").pop();
const vehicleFileName = `vehicle-${Date.now()}.${vehicleExt}`;

const { error: vehicleError } = await supabase.storage
  .from("vehicle-photos")
  .upload(vehicleFileName, formData.vehiclePhoto);

if (vehicleError) {
  console.error("Vehicle upload error:", vehicleError);
  return;
}

console.log(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


const vehiclePhotoUrl = supabase.storage
  .from("vehicle-photos")
  .getPublicUrl(vehicleFileName).data.publicUrl;
  
    // 3️⃣ Insert data into database
    const { error } = await supabase.from("vehicles").insert([
      {
        vehicle_number: formData.vehicleNumber,
        driver_number: formData.driverNumber,
        bill_amount: formData.billAmount,
        bill_photo_url: billPhotoUrl,
        vehicle_photo_url: vehiclePhotoUrl,
      },
    ]);
  
    if (error) {
      alert("Error saving data");
      console.error(error);
    } else {
      alert("Vehicle Entry Saved Successfully");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Vehicle Entry Form
        </h1>
        <p className="text-gray-500 mb-8">
          Enter vehicle and billing details carefully
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Vehicle Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
             Vehicle Number
          </label>
          <input
          type="text"
          name="vehicleNumber"
          placeholder="e.g. DL 01 AB 1234"
          value={formData.vehicleNumber}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 
               text-gray-900 placeholder-gray-400
               focus:ring-2 focus:ring-blue-500 focus:outline-none"
           />
         </div>


          {/* Driver Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Mobile Number
            </label>
            <input
              type="tel"
              name="driverNumber"
              placeholder="e.g. 9876543210"
              value={formData.driverNumber}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 
              text-gray-900 placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:outline-none"            />
          </div>

          {/* Bill Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bill Amount (₹)
            </label>
            <input
              type="number"
              name="billAmount"
              placeholder="Enter amount"
              value={formData.billAmount}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 
              text-gray-900 placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:outline-none"            />
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Bill Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bill Photo
              </label>
              <input
                type="file"
                name="billPhoto"
                accept="image/*"
                onChange={handleChange}
                required
                className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>

            {/* Vehicle Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Photo
              </label>
              <input
                type="file"
                name="vehiclePhoto"
                accept="image/*"
                onChange={handleChange}
                required
                className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              Submit Vehicle Entry
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
