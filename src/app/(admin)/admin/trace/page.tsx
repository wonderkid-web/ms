"use client";

import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";

type TraceEventFormInputs = {
  productId: { label: string; value: string };
  stepName: string;
  location: string;
  notes: string;
  occurredAt: string;
};

// Placeholder for product options. In a real app, this would be fetched from an API.
const productOptions = [
  { value: "product1", label: "Product A" },
  { value: "product2", label: "Product B" },
  { value: "product3", label: "Product C" },
];

export default function TracePage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TraceEventFormInputs>();

  const onSubmit: SubmitHandler<TraceEventFormInputs> = (data) => {
    console.log(data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Create Trace Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
            Product
          </label>
          <Controller
            name="productId"
            control={control}
            rules={{ required: "Product is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={productOptions}
                className="mt-1 block w-full"
              />
            )}
          />
          {errors.productId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.productId.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="stepName" className="block text-sm font-medium text-gray-700">
            Step Name
          </label>
          <input
            type="text"
            id="stepName"
            {...register("stepName", { required: "Step Name is required" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.stepName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.stepName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            {...register("location")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            {...register("notes")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>

        <div>
          <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700">
            Occurred At
          </label>
          <input
            type="datetime-local"
            id="occurredAt"
            {...register("occurredAt", { required: "Occurred At is required" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.occurredAt && (
            <p className="text-red-500 text-xs mt-1">
              {errors.occurredAt.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
        >
          Create Trace Event
        </button>
      </form>
    </div>
  );
}

