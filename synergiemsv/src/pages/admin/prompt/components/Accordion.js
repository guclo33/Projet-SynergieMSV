"use client"

import { useState } from "react"

export function Accordion({ items }) {
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className="accordion-item">
          <div className="accordion-header" onClick={() => toggleItem(item.id)}>
            <span>{item.title}</span>
            <span>{openItems[item.id] ? "−" : "+"}</span>
          </div>
          {openItems[item.id] && <div className="accordion-content">{item.content}</div>}
        </div>
      ))}
    </div>
  )
}

