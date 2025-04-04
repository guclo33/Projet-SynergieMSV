"use client"

import { useState } from "react"

export function ModalForm({ initialData, onSubmit, hasTeam }) {
  const [formData, setFormData] = useState(initialData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitForm = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Version simplifiée sans équipe
  if (!hasTeam) {
    return (
      <form onSubmit={handleSubmitForm} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Courriel :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Téléphone :</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(XXX) XXX-XXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Informations supplémentaires :</label>
          <textarea
            name="additional_infos"
            rows="3"
            value={formData.additional_infos}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button type="submit" className="btn-primary">
            Confirmer
          </button>
        </div>
      </form>
    )
  }

  // Version complète avec équipe
  return (
    <form onSubmit={handleSubmitForm} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Courriel :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Téléphone :</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(XXX) XXX-XXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Montant de la vente :</label>
          <input
            type="number"
            name="price_sold"
            value={formData.price_sold}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Date Échéance :</label>
          <input
            type="date"
            name="echeance"
            value={formData.echeance}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Actif ?</label>
          <select
            name="active"
            value={formData.active}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
          >
            <option value={true}>Oui</option>
            <option value={false}>Non</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Informations supplémentaires :</label>
        <textarea
          name="additional_infos"
          rows="3"
          value={formData.additional_infos}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
        />
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        <button type="submit" className="btn-primary">
          Confirmer
        </button>
      </div>
    </form>
  )
}

