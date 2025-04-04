"use client"

import { useContext } from "react"
import { AuthContext } from "../../../AuthContext"
import { DropZone } from "./DropZone"

export function Documents({ detailsData }) {
  const { user } = useContext(AuthContext)
  const apiU = process.env.REACT_APP_RENDER_API || "http://localhost:3000"
  const apiUrl = `${apiU}/api/admin/${user.id}/details`

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Documents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DropZone detailsData={detailsData} apiUrl={apiUrl} category="profils" />
        <DropZone detailsData={detailsData} apiUrl={apiUrl} category="factures" />
        <DropZone detailsData={detailsData} apiUrl={apiUrl} category="questionnaires" />
        <DropZone detailsData={detailsData} apiUrl={apiUrl} category="photos" />
      </div>
    </div>
  )
}

