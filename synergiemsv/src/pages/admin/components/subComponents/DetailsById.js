"use client"

import { useRef, useState } from "react"
import { GeneralInfos } from "./GeneralInfos"
import { Documents } from "./Documents"
import { Profile } from "./Profile"
import { useContext } from "react"
import { AdminContext } from "../../AdminContext"
import { DetailForm } from "./DetailsForm"
import { ProfileWithJSON } from "./ProfileWithJSON"

export function DetailsById({ detailsData }) {
  const { profilePhotos } = useContext(AdminContext)
  const detailFormRef = useRef(null)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  if (!detailsData || Object.keys(detailsData).length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
        <span className="ml-3 text-xl font-medium">Chargement...</span>
      </div>
    )
  }

  const handleClick = () => {
    detailFormRef.current.scrollIntoView({ behavior: "smooth" })
  }

  const openModal = (contentFn) => {
    setModalContent(contentFn)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalContent(null)
  }

  return (
    <div className="w-full mx-auto pt-20 pb-10 px-4">
      <div className="bg-white rounded-lg shadow-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{detailsData.info.nom_client}</h1>
        </div>

        <div className="p-6 space-y-6">
          <GeneralInfos detailsData={detailsData} openModal={openModal} />

          <Documents detailsData={detailsData} />

          {detailsData && detailsData.form.length > 0 && (
            <div className="mt-6 text-center md:text-right">
              <button onClick={handleClick}>Voir questionnaire</button>
            </div>
          )}

          <div className="mt-6">
            {detailsData.info.profilejson ? (
              <ProfileWithJSON detailsData={detailsData} />
            ) : (
              <Profile detailsData={detailsData} />
            )}
          </div>

          {detailsData && detailsData.form.length > 0 && (
            <div ref={detailFormRef} className="mt-6 pt-4 border-t border-gray-200">
              <DetailForm form={detailsData.form} />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modalContent">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Modifier les informations</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {typeof modalContent === "function" ? modalContent() : modalContent}
          </div>
        </div>
      )}
    </div>
  )
}

