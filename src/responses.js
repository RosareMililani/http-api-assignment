const fs = require('fs'); // pull in the file system module

const cssDisplay = fs.readFileSync(`${__dirname}/../client/style.css`);
const index = fs.readFileSync(`${__dirname}/../client/client.html`);

// helper
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondXML = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'text/xml' });
  response.write(`<response><message>${object.message}</message></response>`);
  response.end();
};

const respond = (request, response, content, type) => {
  response.writeHead(200, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// links - read into server.js
const getIndex = (request, response) => respond(request, response, index, 'text/html');

const getCSS = (request, response) => respond(request, response, cssDisplay, 'text/css');

const getSuccess = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 200, responseJSON); // bail out
  }

  return respondJSON(request, response, 200, responseJSON);
};

const getBadRequest = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // check if validation is true
  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set equal to true';
    responseJSON.id = 'badRequest';

    if (acceptedTypes[0] === 'text/xml') {
      return respondXML(request, response, 400, responseJSON); // bail out
    }
    return respondJSON(request, response, 400, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const getUnauthorized = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // check if validation is true
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing logged in query parameter set to yes';
    responseJSON.id = 'unauthorized';
    if (acceptedTypes[0] === 'text/xml') {
      return respondXML(request, response, 401, responseJSON); // bail out
    }
    return respondJSON(request, response, 401, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const getForbidden = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };

  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 403, responseJSON); // bail out
  }
  return respondJSON(request, response, 403, responseJSON);
};

const getInternal = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong',
    id: 'internalError',
  };

  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 500, responseJSON); // bail out
  }

  return respondJSON(request, response, 500, responseJSON);
};

const getNotImplemented = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'A request for this page has not been implemented yet. Check again later for updated content',
    id: 'notImplemented',
  };

  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 501, responseJSON); // bail out
  }

  return respondJSON(request, response, 501, responseJSON);
};

const getNotFound = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'The page you were looking for was not found',
    id: 'notFound',
  };

  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 404, responseJSON); // bail out
  }

  return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getIndex,
  getSuccess,
  getCSS,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
