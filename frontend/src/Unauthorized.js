import React from "react";

const Unauthorized = () => {
  return (
    <div className="error-page d-flex align-items-center flex-wrap justify-content-center pd-20">
      <div className="pd-10">
        <div className="error-page-wrap text-center">
          <h1>401</h1>
          <h3>Vous n'êtes pas authorisé à accéder à cette page</h3>
          <p>You Seem To Be Trying To Find His Way Home</p>
          <div className="pt-20 mx-auto max-width-200">
            <a href="/" className="btn btn-primary btn-block btn-lg">
              Back To Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
