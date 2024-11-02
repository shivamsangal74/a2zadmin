import React, { useState } from "react";
import Risk from "./Risk";
import "./DefaultRisk.css"; // Create and import a CSS file for styles
import DefaultLayout from "../../layout/DefaultLayout";

const DefaultRisk = () => {
  const [selectedUserid, setSelectedUserid] = useState(null);

  const handleRiskClick = (userid) => {
    setSelectedUserid(userid);
  };

  const plans = [
    { id: "D1", name: "Default Risk Plan 1" },
    { id: "D2", name: "Default Risk Plan 2" },
    { id: "D3", name: "Default Risk Plan 3" },
    { id: "D4", name: "Default Risk Plan 4" },
    { id: "D5", name: "Default Risk Plan 5" },
    { id: "D6", name: "Default Risk Plan 6" },
    { id: "D7", name: "Default Risk Plan 7" },
    { id: "D8", name: "Default Risk Plan 8" },
  ];

  return (
    <DefaultLayout isList={true}>
      <div className="default-risk-container">
        <div className="left-pane">
          <ul className="plan-list">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className={`plan-item ${
                  selectedUserid === plan.id ? "selected" : ""
                }`}
                onClick={() => handleRiskClick(plan.id)}
              >
                {plan.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="right-pane">
          {selectedUserid && (
            <Risk key={selectedUserid} userid={selectedUserid} />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DefaultRisk;
