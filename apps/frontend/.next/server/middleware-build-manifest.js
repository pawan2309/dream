self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/user_details/admin": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user_details/admin.js"
    ],
    "/user_details/agent": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user_details/agent.js"
    ],
    "/user_details/agent/dead": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user_details/agent/dead.js"
    ],
    "/user_details/super_admin": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user_details/super_admin.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];