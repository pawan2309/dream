/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction App({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        let timeout;\n        const refreshSession = async ()=>{\n            clearTimeout(timeout);\n            // Only try to refresh if the session cookie exists\n            if (document.cookie.includes(\"betx_session\")) {\n                try {\n                    const res = await fetch(\"/api/auth/refresh\", {\n                        method: \"POST\"\n                    });\n                    if (!res.ok) {\n                        router.replace(\"/login\");\n                    }\n                } catch  {\n                    router.replace(\"/login\");\n                }\n                timeout = setTimeout(()=>{\n                    router.replace(\"/login\");\n                }, 4.5 * 60 * 1000); // 4.5 minutes\n            }\n        };\n        window.addEventListener(\"mousemove\", refreshSession);\n        window.addEventListener(\"keydown\", refreshSession);\n        // Initial call to set timer\n        refreshSession();\n        return ()=>{\n            window.removeEventListener(\"mousemove\", refreshSession);\n            window.removeEventListener(\"keydown\", refreshSession);\n            clearTimeout(timeout);\n        };\n    }, [\n        router\n    ]);\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        // Add AdminLTE scripts in correct order\n        const loadScript = (src)=>{\n            return new Promise((resolve, reject)=>{\n                const script = document.createElement(\"script\");\n                script.src = src;\n                script.async = true;\n                script.onload = resolve;\n                script.onerror = reject;\n                document.body.appendChild(script);\n            });\n        };\n        const initializeAdminLTE = async ()=>{\n            try {\n                // 1. Load jQuery first\n                await loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/jquery/jquery.min.js\");\n                // 2. Load AdminLTE only after jQuery is loaded\n                await loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/js/adminlte.min.js\");\n                // 3. Load all other scripts (these can be parallel)\n                await Promise.all([\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/bootstrap/js/bootstrap.bundle.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables/jquery.dataTables.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-responsive/js/dataTables.responsive.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-responsive/js/responsive.bootstrap4.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/daterangepicker/daterangepicker.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/moment/moment.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/js/demo.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/toastr/toastr.min.js\")\n                ]);\n                // Initialize AdminLTE after scripts are loaded\n                if (window.AdminLTE) {\n                    window.AdminLTE.init();\n                }\n                // Add AdminLTE classes\n                document.body.classList.add(\"text-sm\");\n                // Set site name\n                const hostname = window.location.hostname;\n                const siteName = hostname.split(\".\")[1]?.toUpperCase() || \"SITE\";\n                document.title = siteName;\n                const siteNameElement = document.getElementById(\"siteName\");\n                if (siteNameElement) {\n                    siteNameElement.textContent = hostname;\n                }\n                const brandNameElement = document.getElementById(\"brandName\");\n                if (brandNameElement) {\n                    brandNameElement.textContent = siteName;\n                }\n            // AdminLTE initialized successfully\n            } catch (error) {\n                console.error(\"Error loading AdminLTE scripts:\", error);\n            }\n        };\n        initializeAdminLTE();\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"D:\\\\Dream\\\\betting\\\\apps\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 103,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RjtRQUVBaEI7SUFDRixHQUFHLEVBQUU7SUFFTCxxQkFBTyw4REFBQzlCO1FBQVcsR0FBR0MsU0FBUzs7Ozs7O0FBQ2pDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmV0dGluZy1mcm9udGVuZC8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJ1xyXG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcydcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XHJcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGxldCB0aW1lb3V0OiBhbnk7XHJcbiAgICBjb25zdCByZWZyZXNoU2Vzc2lvbiA9IGFzeW5jICgpID0+IHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICAvLyBPbmx5IHRyeSB0byByZWZyZXNoIGlmIHRoZSBzZXNzaW9uIGNvb2tpZSBleGlzdHNcclxuICAgICAgaWYgKGRvY3VtZW50LmNvb2tpZS5pbmNsdWRlcygnYmV0eF9zZXNzaW9uJykpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hcGkvYXV0aC9yZWZyZXNoJywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgICAgIGlmICghcmVzLm9rKSB7XHJcbiAgICAgICAgICAgIHJvdXRlci5yZXBsYWNlKCcvbG9naW4nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgIHJvdXRlci5yZXBsYWNlKCcvbG9naW4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgcm91dGVyLnJlcGxhY2UoJy9sb2dpbicpO1xyXG4gICAgICAgIH0sIDQuNSAqIDYwICogMTAwMCk7IC8vIDQuNSBtaW51dGVzXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgcmVmcmVzaFNlc3Npb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZWZyZXNoU2Vzc2lvbik7XHJcbiAgICAvLyBJbml0aWFsIGNhbGwgdG8gc2V0IHRpbWVyXHJcbiAgICByZWZyZXNoU2Vzc2lvbigpO1xyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHJlZnJlc2hTZXNzaW9uKTtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZWZyZXNoU2Vzc2lvbik7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgIH07XHJcbiAgfSwgW3JvdXRlcl0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgLy8gQWRkIEFkbWluTFRFIHNjcmlwdHMgaW4gY29ycmVjdCBvcmRlclxyXG4gICAgY29uc3QgbG9hZFNjcmlwdCA9IChzcmM6IHN0cmluZykgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIHNjcmlwdC5zcmMgPSBzcmM7XHJcbiAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICBzY3JpcHQub25sb2FkID0gcmVzb2x2ZTtcclxuICAgICAgICBzY3JpcHQub25lcnJvciA9IHJlamVjdDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBpbml0aWFsaXplQWRtaW5MVEUgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgLy8gMS4gTG9hZCBqUXVlcnkgZmlyc3RcclxuICAgICAgICBhd2FpdCBsb2FkU2NyaXB0KCdodHRwczovL2FkbWlubGl0ZS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vYWRtaW5saXRlL3BsdWdpbnMvanF1ZXJ5L2pxdWVyeS5taW4uanMnKTtcclxuICAgICAgICAvLyAyLiBMb2FkIEFkbWluTFRFIG9ubHkgYWZ0ZXIgalF1ZXJ5IGlzIGxvYWRlZFxyXG4gICAgICAgIGF3YWl0IGxvYWRTY3JpcHQoJ2h0dHBzOi8vYWRtaW5saXRlLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9hZG1pbmxpdGUvZGlzdC9qcy9hZG1pbmx0ZS5taW4uanMnKTtcclxuICAgICAgICAvLyAzLiBMb2FkIGFsbCBvdGhlciBzY3JpcHRzICh0aGVzZSBjYW4gYmUgcGFyYWxsZWwpXHJcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgICAgbG9hZFNjcmlwdCgnaHR0cHM6Ly9hZG1pbmxpdGUuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FkbWlubGl0ZS9wbHVnaW5zL2Jvb3RzdHJhcC9qcy9ib290c3RyYXAuYnVuZGxlLm1pbi5qcycpLFxyXG4gICAgICAgICAgbG9hZFNjcmlwdCgnaHR0cHM6Ly9hZG1pbmxpdGUuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FkbWlubGl0ZS9wbHVnaW5zL2RhdGF0YWJsZXMvanF1ZXJ5LmRhdGFUYWJsZXMubWluLmpzJyksXHJcbiAgICAgICAgICBsb2FkU2NyaXB0KCdodHRwczovL2FkbWlubGl0ZS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vYWRtaW5saXRlL3BsdWdpbnMvZGF0YXRhYmxlcy1iczQvanMvZGF0YVRhYmxlcy5ib290c3RyYXA0Lm1pbi5qcycpLFxyXG4gICAgICAgICAgbG9hZFNjcmlwdCgnaHR0cHM6Ly9hZG1pbmxpdGUuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FkbWlubGl0ZS9wbHVnaW5zL2RhdGF0YWJsZXMtcmVzcG9uc2l2ZS9qcy9kYXRhVGFibGVzLnJlc3BvbnNpdmUubWluLmpzJyksXHJcbiAgICAgICAgICBsb2FkU2NyaXB0KCdodHRwczovL2FkbWlubGl0ZS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vYWRtaW5saXRlL3BsdWdpbnMvZGF0YXRhYmxlcy1yZXNwb25zaXZlL2pzL3Jlc3BvbnNpdmUuYm9vdHN0cmFwNC5taW4uanMnKSxcclxuICAgICAgICAgIGxvYWRTY3JpcHQoJ2h0dHBzOi8vYWRtaW5saXRlLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9hZG1pbmxpdGUvcGx1Z2lucy9kYXRlcmFuZ2VwaWNrZXIvZGF0ZXJhbmdlcGlja2VyLmpzJyksXHJcbiAgICAgICAgICBsb2FkU2NyaXB0KCdodHRwczovL2FkbWlubGl0ZS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vYWRtaW5saXRlL3BsdWdpbnMvbW9tZW50L21vbWVudC5taW4uanMnKSxcclxuICAgICAgICAgIGxvYWRTY3JpcHQoJ2h0dHBzOi8vYWRtaW5saXRlLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9hZG1pbmxpdGUvcGx1Z2lucy90ZW1wdXNkb21pbnVzLWJvb3RzdHJhcC00L2pzL3RlbXB1c2RvbWludXMtYm9vdHN0cmFwLTQubWluLmpzJyksXHJcbiAgICAgICAgICBsb2FkU2NyaXB0KCdodHRwczovL2FkbWlubGl0ZS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vYWRtaW5saXRlL2Rpc3QvanMvZGVtby5qcycpLFxyXG4gICAgICAgICAgbG9hZFNjcmlwdCgnaHR0cHM6Ly9hZG1pbmxpdGUuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FkbWlubGl0ZS9wbHVnaW5zL3RvYXN0ci90b2FzdHIubWluLmpzJylcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBBZG1pbkxURSBhZnRlciBzY3JpcHRzIGFyZSBsb2FkZWRcclxuICAgICAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLkFkbWluTFRFKSB7XHJcbiAgICAgICAgICAod2luZG93IGFzIGFueSkuQWRtaW5MVEUuaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIEFkbWluTFRFIGNsYXNzZXNcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RleHQtc20nKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBTZXQgc2l0ZSBuYW1lXHJcbiAgICAgICAgY29uc3QgaG9zdG5hbWUgPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICAgICAgY29uc3Qgc2l0ZU5hbWUgPSBob3N0bmFtZS5zcGxpdChcIi5cIilbMV0/LnRvVXBwZXJDYXNlKCkgfHwgJ1NJVEUnO1xyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gc2l0ZU5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc2l0ZU5hbWVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpdGVOYW1lJyk7XHJcbiAgICAgICAgaWYgKHNpdGVOYW1lRWxlbWVudCkge1xyXG4gICAgICAgICAgc2l0ZU5hbWVFbGVtZW50LnRleHRDb250ZW50ID0gaG9zdG5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGJyYW5kTmFtZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnJhbmROYW1lJyk7XHJcbiAgICAgICAgaWYgKGJyYW5kTmFtZUVsZW1lbnQpIHtcclxuICAgICAgICAgIGJyYW5kTmFtZUVsZW1lbnQudGV4dENvbnRlbnQgPSBzaXRlTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkbWluTFRFIGluaXRpYWxpemVkIHN1Y2Nlc3NmdWxseVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGxvYWRpbmcgQWRtaW5MVEUgc2NyaXB0czonLCBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaW5pdGlhbGl6ZUFkbWluTFRFKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4gPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG59IFxyXG4iXSwibmFtZXMiOlsidXNlRWZmZWN0IiwidXNlUm91dGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwicm91dGVyIiwidGltZW91dCIsInJlZnJlc2hTZXNzaW9uIiwiY2xlYXJUaW1lb3V0IiwiZG9jdW1lbnQiLCJjb29raWUiLCJpbmNsdWRlcyIsInJlcyIsImZldGNoIiwibWV0aG9kIiwib2siLCJyZXBsYWNlIiwic2V0VGltZW91dCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibG9hZFNjcmlwdCIsInNyYyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic2NyaXB0IiwiY3JlYXRlRWxlbWVudCIsImFzeW5jIiwib25sb2FkIiwib25lcnJvciIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImluaXRpYWxpemVBZG1pbkxURSIsImFsbCIsIkFkbWluTFRFIiwiaW5pdCIsImNsYXNzTGlzdCIsImFkZCIsImhvc3RuYW1lIiwibG9jYXRpb24iLCJzaXRlTmFtZSIsInNwbGl0IiwidG9VcHBlckNhc2UiLCJ0aXRsZSIsInNpdGVOYW1lRWxlbWVudCIsImdldEVsZW1lbnRCeUlkIiwidGV4dENvbnRlbnQiLCJicmFuZE5hbWVFbGVtZW50IiwiZXJyb3IiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();