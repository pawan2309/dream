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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dayjs */ \"dayjs\");\n/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var dayjs_plugin_weekday__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! dayjs/plugin/weekday */ \"dayjs/plugin/weekday\");\n/* harmony import */ var dayjs_plugin_weekday__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_weekday__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\ndayjs__WEBPACK_IMPORTED_MODULE_4___default().extend((dayjs_plugin_weekday__WEBPACK_IMPORTED_MODULE_5___default()));\n// import { ConfigProvider, theme as antdTheme } from 'antd';\n// import 'antd/dist/antd.css';\nfunction App({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        let timeout;\n        const refreshSession = async ()=>{\n            clearTimeout(timeout);\n            // Only try to refresh if the session cookie exists\n            if (document.cookie.includes(\"betx_session\")) {\n                try {\n                    const res = await fetch(\"/api/auth/refresh\", {\n                        method: \"POST\"\n                    });\n                    if (!res.ok) {\n                        router.replace(\"/login\");\n                    }\n                } catch  {\n                    router.replace(\"/login\");\n                }\n                timeout = setTimeout(()=>{\n                    router.replace(\"/login\");\n                }, 4.5 * 60 * 1000); // 4.5 minutes\n            }\n        };\n        window.addEventListener(\"mousemove\", refreshSession);\n        window.addEventListener(\"keydown\", refreshSession);\n        // Initial call to set timer\n        refreshSession();\n        return ()=>{\n            window.removeEventListener(\"mousemove\", refreshSession);\n            window.removeEventListener(\"keydown\", refreshSession);\n            clearTimeout(timeout);\n        };\n    }, [\n        router\n    ]);\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        // Add AdminLTE scripts in correct order\n        const loadScript = (src)=>{\n            return new Promise((resolve, reject)=>{\n                const script = document.createElement(\"script\");\n                script.src = src;\n                script.async = true;\n                script.onload = resolve;\n                script.onerror = reject;\n                document.body.appendChild(script);\n            });\n        };\n        const initializeAdminLTE = async ()=>{\n            try {\n                // 1. Load jQuery first\n                await loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/jquery/jquery.min.js\");\n                // 2. Load AdminLTE only after jQuery is loaded\n                await loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/js/adminlte.min.js\");\n                // 3. Load all other scripts (these can be parallel)\n                await Promise.all([\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/bootstrap/js/bootstrap.bundle.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables/jquery.dataTables.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-responsive/js/dataTables.responsive.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-responsive/js/responsive.bootstrap4.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/daterangepicker/daterangepicker.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/moment/moment.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/js/demo.js\"),\n                    loadScript(\"https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/toastr/toastr.min.js\")\n                ]);\n                // Initialize AdminLTE after scripts are loaded\n                if (window.AdminLTE) {\n                    window.AdminLTE.init();\n                }\n                // Add AdminLTE classes\n                document.body.classList.add(\"text-sm\");\n                // Set site name\n                const hostname = window.location.hostname;\n                const siteName = hostname.split(\".\")[1]?.toUpperCase() || \"SITE\";\n                document.title = siteName;\n                const siteNameElement = document.getElementById(\"siteName\");\n                if (siteNameElement) {\n                    siteNameElement.textContent = hostname;\n                }\n                const brandNameElement = document.getElementById(\"brandName\");\n                if (brandNameElement) {\n                    brandNameElement.textContent = siteName;\n                }\n            // AdminLTE initialized successfully\n            } catch (error) {\n                console.error(\"Error loading AdminLTE scripts:\", error);\n            }\n        };\n        initializeAdminLTE();\n    }, []);\n    return(// <ConfigProvider theme={{ algorithm: antdTheme.darkAlgorithm }}>\n    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"D:\\\\Dream\\\\betting\\\\apps\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 110,\n        columnNumber: 7\n    }, this));\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFvQztZQUN0QyxFQUFFLE9BQU9RLE9BQU87Z0JBQ2RDLFFBQVFELEtBQUssQ0FBQyxtQ0FBbUNBO1lBQ25EO1FBQ0Y7UUFFQWhCO0lBQ0YsR0FBRyxFQUFFO0lBRUwsT0FDRSxrRUFBa0U7a0JBQ2hFLDhEQUFDOUI7UUFBVyxHQUFHQyxTQUFTOzs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iZXR0aW5nLWZyb250ZW5kLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnXHJcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xyXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnO1xyXG5pbXBvcnQgd2Vla2RheSBmcm9tICdkYXlqcy9wbHVnaW4vd2Vla2RheSc7XHJcbmRheWpzLmV4dGVuZCh3ZWVrZGF5KTtcclxuLy8gaW1wb3J0IHsgQ29uZmlnUHJvdmlkZXIsIHRoZW1lIGFzIGFudGRUaGVtZSB9IGZyb20gJ2FudGQnO1xyXG4vLyBpbXBvcnQgJ2FudGQvZGlzdC9hbnRkLmNzcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBsZXQgdGltZW91dDogYW55O1xyXG4gICAgY29uc3QgcmVmcmVzaFNlc3Npb24gPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgLy8gT25seSB0cnkgdG8gcmVmcmVzaCBpZiB0aGUgc2Vzc2lvbiBjb29raWUgZXhpc3RzXHJcbiAgICAgIGlmIChkb2N1bWVudC5jb29raWUuaW5jbHVkZXMoJ2JldHhfc2Vzc2lvbicpKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL2F1dGgvcmVmcmVzaCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgICAgICBpZiAoIXJlcy5vaykge1xyXG4gICAgICAgICAgICByb3V0ZXIucmVwbGFjZSgnL2xvZ2luJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICByb3V0ZXIucmVwbGFjZSgnL2xvZ2luJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHJvdXRlci5yZXBsYWNlKCcvbG9naW4nKTtcclxuICAgICAgICB9LCA0LjUgKiA2MCAqIDEwMDApOyAvLyA0LjUgbWludXRlc1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHJlZnJlc2hTZXNzaW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVmcmVzaFNlc3Npb24pO1xyXG4gICAgLy8gSW5pdGlhbCBjYWxsIHRvIHNldCB0aW1lclxyXG4gICAgcmVmcmVzaFNlc3Npb24oKTtcclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCByZWZyZXNoU2Vzc2lvbik7XHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVmcmVzaFNlc3Npb24pO1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICB9O1xyXG4gIH0sIFtyb3V0ZXJdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIC8vIEFkZCBBZG1pbkxURSBzY3JpcHRzIGluIGNvcnJlY3Qgb3JkZXJcclxuICAgIGNvbnN0IGxvYWRTY3JpcHQgPSAoc3JjOiBzdHJpbmcpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICBzY3JpcHQuc3JjID0gc3JjO1xyXG4gICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IHJlc29sdmU7XHJcbiAgICAgICAgc2NyaXB0Lm9uZXJyb3IgPSByZWplY3Q7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaW5pdGlhbGl6ZUFkbWluTFRFID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIC8vIDEuIExvYWQgalF1ZXJ5IGZpcnN0XHJcbiAgICAgICAgYXdhaXQgbG9hZFNjcmlwdCgnaHR0cHM6Ly9hZG1pbmxpdGUuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FkbWlubGl0ZS9wbHVnaW5zL2pxdWVyeS9qcXVlcnkubWluLmpzJyk7XHJcbiAgICAgICAgLy8gMi4gTG9hZCBBZG1pbkxURSBvbmx5IGFmdGVyIGpRdWVyeSBpcyBsb2FkZWRcclxuICAgICAgICBhd2FpdCBsb2FkU2NyaXB0KCdodHRwczovL2FkbWlubGl0ZS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vYWRtaW5saXRlL2Rpc3QvanMvYWRtaW5sdGUubWluLmpzJyk7XHJcbiAgICAgICAgLy8gMy4gTG9hZCBhbGwgb3RoZXIgc2NyaXB0cyAodGhlc2UgY2FuIGJlIHBhcmFsbGVsKVxyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICAgIGxvYWRTY3JpcHQoJ2h0dHBzOi8vYWRtaW5saXRlLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9hZG1pbmxpdGUvcGx1Z2lucy9ib290c3RyYXAvanMvYm9vdHN0cmFwLmJ1bmRsZS5taW4uanMnKSxcclxuICAgICAgICAgIGxvYWRTY3JpcHQoJ2h0dHBzOi8vYWRtaW5saXRlLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9hZG1pbmxpdGUvcGx1Z2lucy9kYXRhdGFibGVzL2pxdWVyeS5kYXRhVGFibGVzLm1pbi5qcycpLFxyXG4gICAgICAgICAgbG9hZFNjcmlwdCgnaHR0cHM6Ly9hZG1pbmxpdGUuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FkbWlubGl0ZS9wbHVnaW5zL2RhdGF0YWJsZXMtYnM0L2pzL2RhdGFUYWJsZXMuYm9vdHN0cmFwNC5taW4uanMnKSxcclxuICAgICAgICAgIGxvYWRTY3JpcHQoJ2h0dHBzOi8vYWRtaW5saXRlLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9hZG1pbmxpdGUvcGx1Z2lucy9kYXRhdGFibGVzLXJlc3BvbnNpdmUvanMvZGF0YVRhYmxlcy5yZXNwb25zaXZlLm1pbi5qcycpLFxyXG4gICAgICAgICAgbG9hZFNjcmlwdCgnaHR0cHM6Ly9hZG1pbmxpdGUuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FkbWlubGl0ZS9wbHVnaW5zL2RhdGF0YWJsZXMtcmVzcG9uc2l2ZS9qcy9yZXNwb25zaXZlLmJvb3RzdHJhcDQubWluLmpzJyksXHJcbiAgICAgICAgICBsb2FkU2NyaXB0KCdodHRwczovL2FkbWlubGl0ZS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vYWRtaW5saXRlL3BsdWdpbnMvZGF0ZXJhbmdlcGlja2VyL2RhdGVyYW5nZXBpY2tlci5qcycpLFxyXG4gICAgICAgICAgbG9hZFNjcmlwdCgnaHR0cHM6Ly9hZG1pbmxpdGUuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FkbWlubGl0ZS9wbHVnaW5zL21vbWVudC9tb21lbnQubWluLmpzJyksXHJcbiAgICAgICAgICBsb2FkU2NyaXB0KCdodHRwczovL2FkbWlubGl0ZS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vYWRtaW5saXRlL3BsdWdpbnMvdGVtcHVzZG9taW51cy1ib290c3RyYXAtNC9qcy90ZW1wdXNkb21pbnVzLWJvb3RzdHJhcC00Lm1pbi5qcycpLFxyXG4gICAgICAgICAgbG9hZFNjcmlwdCgnaHR0cHM6Ly9hZG1pbmxpdGUuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FkbWlubGl0ZS9kaXN0L2pzL2RlbW8uanMnKSxcclxuICAgICAgICAgIGxvYWRTY3JpcHQoJ2h0dHBzOi8vYWRtaW5saXRlLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9hZG1pbmxpdGUvcGx1Z2lucy90b2FzdHIvdG9hc3RyLm1pbi5qcycpXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpemUgQWRtaW5MVEUgYWZ0ZXIgc2NyaXB0cyBhcmUgbG9hZGVkXHJcbiAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS5BZG1pbkxURSkge1xyXG4gICAgICAgICAgKHdpbmRvdyBhcyBhbnkpLkFkbWluTFRFLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBBZG1pbkxURSBjbGFzc2VzXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0ZXh0LXNtJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU2V0IHNpdGUgbmFtZVxyXG4gICAgICAgIGNvbnN0IGhvc3RuYW1lID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xyXG4gICAgICAgIGNvbnN0IHNpdGVOYW1lID0gaG9zdG5hbWUuc3BsaXQoXCIuXCIpWzFdPy50b1VwcGVyQ2FzZSgpIHx8ICdTSVRFJztcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IHNpdGVOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHNpdGVOYW1lRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaXRlTmFtZScpO1xyXG4gICAgICAgIGlmIChzaXRlTmFtZUVsZW1lbnQpIHtcclxuICAgICAgICAgIHNpdGVOYW1lRWxlbWVudC50ZXh0Q29udGVudCA9IGhvc3RuYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBicmFuZE5hbWVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JyYW5kTmFtZScpO1xyXG4gICAgICAgIGlmIChicmFuZE5hbWVFbGVtZW50KSB7XHJcbiAgICAgICAgICBicmFuZE5hbWVFbGVtZW50LnRleHRDb250ZW50ID0gc2l0ZU5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZG1pbkxURSBpbml0aWFsaXplZCBzdWNjZXNzZnVsbHlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIEFkbWluTFRFIHNjcmlwdHM6JywgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGluaXRpYWxpemVBZG1pbkxURSgpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIC8vIDxDb25maWdQcm92aWRlciB0aGVtZT17eyBhbGdvcml0aG06IGFudGRUaGVtZS5kYXJrQWxnb3JpdGhtIH19PlxyXG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICAvLyA8L0NvbmZpZ1Byb3ZpZGVyPlxyXG4gICk7XHJcbn0gXHJcbiJdLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJ1c2VSb3V0ZXIiLCJkYXlqcyIsIndlZWtkYXkiLCJleHRlbmQiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJyb3V0ZXIiLCJ0aW1lb3V0IiwicmVmcmVzaFNlc3Npb24iLCJjbGVhclRpbWVvdXQiLCJkb2N1bWVudCIsImNvb2tpZSIsImluY2x1ZGVzIiwicmVzIiwiZmV0Y2giLCJtZXRob2QiLCJvayIsInJlcGxhY2UiLCJzZXRUaW1lb3V0Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsb2FkU2NyaXB0Iiwic3JjIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzY3JpcHQiLCJjcmVhdGVFbGVtZW50IiwiYXN5bmMiLCJvbmxvYWQiLCJvbmVycm9yIiwiYm9keSIsImFwcGVuZENoaWxkIiwiaW5pdGlhbGl6ZUFkbWluTFRFIiwiYWxsIiwiQWRtaW5MVEUiLCJpbml0IiwiY2xhc3NMaXN0IiwiYWRkIiwiaG9zdG5hbWUiLCJsb2NhdGlvbiIsInNpdGVOYW1lIiwic3BsaXQiLCJ0b1VwcGVyQ2FzZSIsInRpdGxlIiwic2l0ZU5hbWVFbGVtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ0ZXh0Q29udGVudCIsImJyYW5kTmFtZUVsZW1lbnQiLCJlcnJvciIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "dayjs":
/*!************************!*\
  !*** external "dayjs" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("dayjs");

/***/ }),

/***/ "dayjs/plugin/weekday":
/*!***************************************!*\
  !*** external "dayjs/plugin/weekday" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("dayjs/plugin/weekday");

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