import React from "react";
import axios from "axios";

const CancelButtonQuote = ({ idQuote, onCancelSuccess }) => {
    const token = localStorage.getItem("token");

    const handleCancel = async () => {
        const confirm = window.confirm("Are you sure you want to cancel this appointment?");
        if (!confirm) return;

        try {
            await axios.put(
                `http://localhost:3000/api/v1/quotes/cancel/cancelCustomerQuote/${idQuote}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Quote cancelled successfully.");
            if (onCancelSuccess) onCancelSuccess();
        } catch (error) {
            console.error("Error cancelling the quote:", error);
            alert("An error occurred while cancelling the quote.");
        }
    };

    return <button onClick={handleCancel}>Cancel</button>;
};

export default CancelButtonQuote;
