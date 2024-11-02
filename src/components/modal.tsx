import React, { useState, useEffect } from "react";
import { ButtonLabel } from "./Button/Button";
import { getLatestCashData } from "../Services/transaction";
import { toast } from "react-toastify";

interface CashAmounts {
  note1000: number;
  note500: number;
  note200: number;
  note100: number;
  note50: number;
  note20: number;
  note10: number;
  note5: number;
  note2: number;
  note1: number;
}

const CashModal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (cashAmounts: CashAmounts) => void;
  type?: string;
  amount?: number;
  cashAmounts: CashAmounts; // Add onSubmit prop
}> = ({ isOpen, onRequestClose, onSubmit, type, amount, cashAmounts }) => {
  const [localCashAmounts, setLocalCashAmounts] = useState<CashAmounts>({
    ...cashAmounts,
  });
  const [totalLocalCash, setTotalLocalCash] = useState(0);
  const [totalNewCash, setTotalNewCash] = useState(0);
  const [newCashAmounts, setNewCashAmounts] = useState<CashAmounts>({
    note1000: 0,
    note500: 0,
    note200: 0,
    note100: 0,
    note50: 0,
    note20: 0,
    note10: 0,
    note5: 0,
    note2: 0,
    note1: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cashData = await getLatestCashData();
        if (cashData) {
          const parsedCashData = {
            note1000: parseInt(cashData.cashData.note1000, 10),
            note500: parseInt(cashData.cashData.note500, 10),
            note200: parseInt(cashData.cashData.note200, 10),
            note100: parseInt(cashData.cashData.note100, 10),
            note50: parseInt(cashData.cashData.note50, 10),
            note20: parseInt(cashData.cashData.note20, 10),
            note10: parseInt(cashData.cashData.note10, 10),
            note5: parseInt(cashData.cashData.note5, 10),
            note2: parseInt(cashData.cashData.note2, 10),
            note1: parseInt(cashData.cashData.note1, 10),
          };
          const _totalLocalCash =
            localCashAmounts.note1000 * 1000 +
            localCashAmounts.note500 * 500 +
            localCashAmounts.note200 * 200 +
            localCashAmounts.note100 * 100 +
            localCashAmounts.note50 * 50 +
            localCashAmounts.note20 * 20 +
            localCashAmounts.note10 * 10 +
            localCashAmounts.note5 * 5 +
            localCashAmounts.note2 * 2 +
            localCashAmounts.note1 * 1;
          setTotalLocalCash(_totalLocalCash);
          setLocalCashAmounts(parsedCashData);
          setNewCashAmounts({
            note1000: 0,
            note500: 0,
            note200: 0,
            note100: 0,
            note50: 0,
            note20: 0,
            note10: 0,
            note5: 0,
            note2: 0,
            note1: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [cashAmounts, isOpen]);

  useEffect(() => {
    const _totalNewCash =
      newCashAmounts.note1000 * 1000 +
      newCashAmounts.note500 * 500 +
      newCashAmounts.note200 * 200 +
      newCashAmounts.note100 * 100 +
      newCashAmounts.note50 * 50 +
      newCashAmounts.note20 * 20 +
      newCashAmounts.note10 * 10 +
      newCashAmounts.note5 * 5 +
      newCashAmounts.note2 * 2 +
      newCashAmounts.note1 * 1;
    setTotalNewCash(_totalNewCash);
  }, [newCashAmounts]);

  const handleAmountChange = (note: keyof CashAmounts, value: string) => {
    setNewCashAmounts((prevState) => ({
      ...prevState,
      [note]: parseInt(value, 10),
    }));
  };
  const handleSubmit = () => {
    if (type === "Transfer") {
      if (totalNewCash !== amount) {
        toast.error("amount does not match");
        return;
      }
      const updatedCashAmounts = {
        noteIn1000: newCashAmounts.note1000,
        noteIn500: newCashAmounts.note500,
        noteIn200: newCashAmounts.note200,
        noteIn100: newCashAmounts.note100,
        noteIn50: newCashAmounts.note50,
        noteIn20: newCashAmounts.note20,
        noteIn10: newCashAmounts.note10,
        noteIn5: newCashAmounts.note5,
        noteIn2: newCashAmounts.note2,
        noteIn1: newCashAmounts.note1,
        note1000: localCashAmounts.note1000 - newCashAmounts.note1000,
        note500: localCashAmounts.note500 - newCashAmounts.note500,
        note200: localCashAmounts.note200 - newCashAmounts.note200,
        note100: localCashAmounts.note100 - newCashAmounts.note100,
        note50: localCashAmounts.note50 - newCashAmounts.note50,
        note20: localCashAmounts.note20 - newCashAmounts.note20,
        note10: localCashAmounts.note10 - newCashAmounts.note10,
        note5: localCashAmounts.note5 - newCashAmounts.note5,
        note2: localCashAmounts.note2 - newCashAmounts.note2,
        note1: localCashAmounts.note1 - newCashAmounts.note1,
      };

      onSubmit(updatedCashAmounts);
    } else {
      const updatedCashAmounts = {
        noteIn1000: newCashAmounts.note1000,
        noteIn500: newCashAmounts.note500,
        noteIn200: newCashAmounts.note200,
        noteIn100: newCashAmounts.note100,
        noteIn50: newCashAmounts.note50,
        noteIn20: newCashAmounts.note20,
        noteIn10: newCashAmounts.note10,
        noteIn5: newCashAmounts.note5,
        noteIn2: newCashAmounts.note2,
        noteIn1: newCashAmounts.note1,
        note1000: localCashAmounts.note1000 + newCashAmounts.note1000,
        note500: localCashAmounts.note500 + newCashAmounts.note500,
        note200: localCashAmounts.note200 + newCashAmounts.note200,
        note100: localCashAmounts.note100 + newCashAmounts.note100,
        note50: localCashAmounts.note50 + newCashAmounts.note50,
        note20: localCashAmounts.note20 + newCashAmounts.note20,
        note10: localCashAmounts.note10 + newCashAmounts.note10,
        note5: localCashAmounts.note5 + newCashAmounts.note5,
        note2: localCashAmounts.note2 + newCashAmounts.note2,
        note1: localCashAmounts.note1 + newCashAmounts.note1,
      };
      onSubmit(updatedCashAmounts);
    }

    onRequestClose();
  };

  return (
    isOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 border"
        style={{ zIndex: "10" }}
      >
        <div
          className="bg-white p-6 rounded shadow-lg gap-4 border"
          style={{ width: "400px" }}
        >
          <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
            Cash Available
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontWeight: "bold" }}>Current Amounts</h3>
              <ul>
                {Object.entries(localCashAmounts).map(([note, amount]) => (
                  <li key={note}>
                    ₹{note.split("note")[1]} : {amount}
                  </li>
                ))}
                <li>Total Amount : ₹{totalLocalCash}</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontWeight: "bold" }}>Add New Amounts</h3>
              <div>
                {/* <label htmlFor="note1000"> Note :</label> */}
                <input
                  type="number"
                  id="note1000"
                  typeof="number"
                  value={newCashAmounts.note1000}
                  onChange={(e) =>
                    handleAmountChange("note1000", e.target.value)
                  }
                />
              </div>
              <div>
                <input
                  type="number"
                  id="note500"
                  typeof="number"
                  value={newCashAmounts.note500}
                  onChange={(e) =>
                    handleAmountChange("note500", e.target.value)
                  }
                />
              </div>
              <div>
                <input
                  type="number"
                  id="note200"
                  typeof="number"
                  value={newCashAmounts.note200}
                  onChange={(e) =>
                    handleAmountChange("note200", e.target.value)
                  }
                />
              </div>
              <div>
                <input
                  type="number"
                  id="note100"
                  typeof="number"
                  value={newCashAmounts.note100}
                  onChange={(e) =>
                    handleAmountChange("note100", e.target.value)
                  }
                />
              </div>
              <div>
                <input
                  type="number"
                  id="note50"
                  typeof="number"
                  value={newCashAmounts.note50}
                  onChange={(e) => handleAmountChange("note50", e.target.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  id="note20"
                  typeof="number"
                  value={newCashAmounts.note20}
                  onChange={(e) => handleAmountChange("note20", e.target.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  id="note10"
                  typeof="number"
                  value={newCashAmounts.note10}
                  onChange={(e) => handleAmountChange("note10", e.target.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  id="note5"
                  typeof="number"
                  value={newCashAmounts.note5}
                  onChange={(e) => handleAmountChange("note5", e.target.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  id="note2"
                  typeof="number"
                  value={newCashAmounts.note2}
                  onChange={(e) => handleAmountChange("note2", e.target.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  id="note1"
                  typeof="number"
                  value={newCashAmounts.note1}
                  onChange={(e) => handleAmountChange("note1", e.target.value)}
                />
              </div>
              <p>{totalNewCash}</p>
            </div>
          </div>
          <ButtonLabel
            style={{
              backgroundColor: "blue",
              marginLeft: "10%",
              marginRight: "5%",
              marginTop: "10%",
            }}
            onClick={handleSubmit} // Call handleSubmit on Submit button click
            label="Submit"
          />
          <ButtonLabel
            style={{ backgroundColor: "red", marginTop: "10%" }}
            onClick={onRequestClose}
            label="Close"
          />
        </div>
      </div>
    )
  );
};

export default CashModal;
