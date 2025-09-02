import React from "react"

/**
 * Soft “aurora/bokeh” blobs + vignette.
 * Pure CSS, lightweight, no libs. Sits behind the app.
 */
export default function CinematicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* big blurred blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* subtle dark vignette around edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  )
}
