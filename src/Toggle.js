import React from 'react'
import '../src/App.css';

const Toggle = ({ value, onChange }) => (
  <div className="label">
    <span onClick={onChange} checked={value} className="material-symbols-outlined btn-toggle button bedtime">
        bedtime
    </span>
    <span onClick={onChange} checked={value} className="material-symbols-outlined btn-toggle button hidden clear_day">
        clear_day
    </span>
  </div>
)

export default Toggle