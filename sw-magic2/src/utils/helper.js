import * as cstConstants from "./constants.js";

export async function getApiCall(dataSource) {
  return fetch(
    `${cstConstants.REACT_APP_TRIRIGA_API_URL}${dataSource}?countOnly=false`,
    {
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  ).then(
    function (response) {
      // check if the request is authorized
      if (response.status === 401) {
        // unauthorized navigate Tririga login page for authentication
        var redirect = window.location.href;
        redirect =
          cstConstants.REACT_APP_TRIRIGA_URL +
          "/p/websignon?redirectUrl=" +
          redirect;
        window.location.href = redirect;
      }
      return response.json();
    },
    (error) => {
      console.log("helper-->error::", error);
    }
  );
}

export async function performAction(dataSource, data, actionGroup, action) {
  return fetch(
    `${cstConstants.REACT_APP_TRIRIGA_API_URL}${dataSource}?actionGroup=${actionGroup}&action=${action}&refresh=true`,
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data }),
    }
  ).then(
    function (response) {
      // check if the request is authorized
      if (response.status === 401) {
        // unauthorized navigate Tririga login page for authentication
        var redirect = window.location.href;
        redirect =
          cstConstants.REACT_APP_TRIRIGA_URL +
          "/p/websignon?redirectUrl=" +
          redirect;
        window.location.href = redirect;
      }

      // get current user data from the response
      return response.json();
    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
      console.log("helper-->error::", error);
    }
  );
}
