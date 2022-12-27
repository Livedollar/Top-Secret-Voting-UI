import React, { useState } from "react";

const VoteUI = () => {
  // State variables to store user input
  const [roundId, setRoundId] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [ancillaryData, setAncillaryData] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");

  // Function to run when the form is submitted
  const handleSubmit = (event) => {
    event.preventDefault();

    // Call the voteParams function with the user input values
    voteParams(roundId, identifier, ancillaryData, price, time);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Round ID:
        <input
          type="text"
          value={roundId}
          onChange={(event) => setRoundId(event.target.value)}
        />
      </label>
      <br />
      <label>
        Identifier:
        <input
          type="text"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />
      </label>
      <br />
      <label>
        Ancillary Data:
        <input
          type="text"
          value={ancillaryData}
          onChange={(event) => setAncillaryData(event.target.value)}
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="text"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </label>
      <br />
      <label>
        Time:
        <input
          type="text"
          value={time}
          onChange={(event) => setTime(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default VoteUI;