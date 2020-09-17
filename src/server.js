const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// call the links
const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success': responseHandler.getSuccess,
  '/badRequest': responseHandler.getBadRequest,
  '/badRequest?valid=true': responseHandler.getBadRequest,
  '/unauthorized': responseHandler.getUnauthorized,
  '/unauthorized?loggedIn=yes': responseHandler.getUnauthorized,
  '/forbidden': responseHandler.getForbidden,
  '/internal': responseHandler.getInternal,
  '/notImplemented': responseHandler.getNotImplemented,
  '/notFound': responseHandler.getNotFound,
  notFound: responseHandler.getNotFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  // const { valid } = query.parse(parsedUrl.query);
  // const { loggedIn } = query.parse(parsedUrl.query);
  // const valid = query.parse(parsedUrl.query).valid;
  const acceptedTypes = request.headers.accept.split(',');
  // console.dir(parsedUrl);
  // console.log(acceptedTypes);
  // console.dir(params);
  // console.dir(valid);
  // console.dir(loggedIn);
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, params, acceptedTypes);
  } else {
    urlStruct.notFound(request, response, params, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port);

// console.log(`Listening on 127.0.0.1: ${port}`);
