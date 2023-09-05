import React from 'react'
import '../src/App.css';

const Toggle = ({ value, onChange, ...props }) => (
  <div className="label">
    <span onClick={onChange} checked={value} className={props.butOne}>
        bedtime
    </span>
    <span onClick={onChange} checked={value} className={props.butTwo}>
        clear_day
    </span>
  </div>
)

export default Toggle