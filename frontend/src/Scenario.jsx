import { useState } from "react";
import PropTypes from "prop-types";

import UploadFile from "./UploadFile";

function ScenarioDisplay({ targetUrl }) {
  const [odds, setOdds] = useState();
  const [error, setError] = useState();
  const onUploadSuccess = (data) => {
    setOdds(data);
    setError(undefined);
  };
  const onUploadError = (err) => {
    setOdds(undefined);
    setError(String(err));
  };

  return (
    <>
      <h2>Run scenario</h2>
      <UploadFile
        onUploadSuccess={onUploadSuccess}
        onUploadError={onUploadError}
        targetUrl={targetUrl}
      />
      {odds && <h3>Odds: {Math.round(odds * 100)}%</h3>}
      {error && (
        <h3>Something went wrong, did you upload a proper file ? : {error}</h3>
      )}
    </>
  );
}
ScenarioDisplay.propTypes = {
  targetUrl: PropTypes.string.isRequired,
};

export default ScenarioDisplay;
