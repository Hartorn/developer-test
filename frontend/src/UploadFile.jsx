import { useState, useRef } from "react";
import PropTypes from "prop-types";

function UploadFile({ onUploadSuccess, onUploadError, targetUrl }) {
  const [file, setFile] = useState();
  const inputFileRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      onUploadSuccess(undefined);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("scenario_file", file);

    fetch(targetUrl, {
      method: "POST",
      body: body,
    })
      .then((res) =>
        res.status == 200
          ? res.json()
          : res.text().then((err) => Promise.reject(err)),
      )
      .then(onUploadSuccess)
      .catch(onUploadError);
  };

  return (
    <div>
      <div>
        <button onClick={() => inputFileRef.current.click()}>
          Choose a file
        </button>
        <input
          hidden
          type="file"
          onChange={handleFileChange}
          ref={inputFileRef}
        />
      </div>
      <div>{file && <p>Chosen file: {file && `${file.name}`}</p>}</div>
      <div>{file && <button onClick={handleUploadClick}>Upload</button>}</div>
    </div>
  );
}
UploadFile.propTypes = {
  targetUrl: PropTypes.string.isRequired,
  onUploadSuccess: PropTypes.func.isRequired,
  onUploadError: PropTypes.func.isRequired,
};
export default UploadFile;
