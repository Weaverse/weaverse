var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { Weaverse, WeaverseItemStore } from "@weaverse/react";

// src/elements/third-party.tsx
import { WeaverseContext as WeaverseContext2 } from "@weaverse/react";
import { forwardRef as forwardRef3, useContext as useContext2 } from "react";

// src/components/background.tsx
import { jsx } from "react/jsx-runtime";
function Background(props) {
  let {
    backgroundColor,
    backgroundImage,
    backgroundFit,
    backgroundPosition,
    className
  } = props;
  let style = {
    display: "block",
    position: "absolute",
    inset: 0,
    backgroundColor
  };
  if (backgroundImage || backgroundColor) {
    return /* @__PURE__ */ jsx("div", { className, style, children: backgroundImage && /* @__PURE__ */ jsx(
      "img",
      {
        alt: "Background",
        height: "100%",
        loading: "lazy",
        src: typeof backgroundImage === "object" ? backgroundImage.url : backgroundImage,
        style: {
          objectFit: backgroundFit,
          objectPosition: backgroundPosition
        },
        width: "100%"
      }
    ) });
  }
  return null;
}

// ../../node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
var clsx_default = clsx;

// src/components/icons/phosphor.tsx
var phosphor_exports = {};
__export(phosphor_exports, {
  ArrowLeft: () => ArrowLeft,
  ArrowRight: () => ArrowRight,
  Backpack: () => Backpack,
  CaretLeft: () => CaretLeft,
  CaretRight: () => CaretRight,
  Circle: () => Circle,
  CircleNotch: () => CircleNotch,
  Eye: () => Eye,
  HandBag: () => HandBag,
  Image: () => Image,
  Minus: () => Minus,
  Newspaper: () => Newspaper,
  Package: () => Package,
  Plus: () => Plus,
  ShoppingCart: () => ShoppingCart,
  Storefront: () => Storefront,
  Tag: () => Tag,
  X: () => X
});
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var Circle = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2("circle", { cx: "128", cy: "128", r: "104" })
    ]
  }
);
var CircleNotch = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "none",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2(
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "4",
          style: { opacity: ".25" }
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
          fill: "currentColor",
          style: { opacity: ".75" }
        }
      )
    ]
  }
);
var X = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "20",
    viewBox: "0 0 256 256",
    width: "20",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12",
          x1: "200",
          x2: "56",
          y1: "56",
          y2: "200"
        }
      ),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12",
          x1: "200",
          x2: "56",
          y1: "200",
          y2: "56"
        }
      )
    ]
  }
);
var Minus = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16",
          x1: "40",
          x2: "216",
          y1: "128",
          y2: "128"
        }
      )
    ]
  }
);
var Plus = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16",
          x1: "40",
          x2: "216",
          y1: "128",
          y2: "128"
        }
      ),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16",
          x1: "128",
          x2: "128",
          y1: "40",
          y2: "216"
        }
      )
    ]
  }
);
var CaretLeft = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "polyline",
        {
          fill: "none",
          points: "160 208 80 128 160 48",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      )
    ]
  }
);
var CaretRight = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "polyline",
        {
          fill: "none",
          points: "96 48 176 128 96 208",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      )
    ]
  }
);
var ArrowLeft = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16",
          x1: "216",
          x2: "40",
          y1: "128",
          y2: "128"
        }
      ),
      /* @__PURE__ */ jsx2(
        "polyline",
        {
          fill: "none",
          points: "112 56 40 128 112 200",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      )
    ]
  }
);
var ArrowRight = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16",
          x1: "40",
          x2: "216",
          y1: "128",
          y2: "128"
        }
      ),
      /* @__PURE__ */ jsx2(
        "polyline",
        {
          fill: "none",
          points: "144 56 216 128 144 200",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      )
    ]
  }
);
var Image = (props) => /* @__PURE__ */ jsx2(
  "svg",
  {
    "aria-hidden": "true",
    fill: "currentColor",
    viewBox: "0 0 640 512",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx2("path", { d: "M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" })
  }
);
var ShoppingCart = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M184,184H69.8L41.9,30.6A8,8,0,0,0,34.1,24H16",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      ),
      /* @__PURE__ */ jsx2(
        "circle",
        {
          cx: "80",
          cy: "204",
          fill: "none",
          r: "20",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      ),
      /* @__PURE__ */ jsx2(
        "circle",
        {
          cx: "184",
          cy: "204",
          fill: "none",
          r: "20",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M62.5,144H188.1a15.9,15.9,0,0,0,15.7-13.1L216,64H48",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      )
    ]
  }
);
var Storefront = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M48,139.6V208a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V139.6",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M54,40H202a8.1,8.1,0,0,1,7.7,5.8L224,96H32L46.3,45.8A8.1,8.1,0,0,1,54,40Z",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M96,96v16a32,32,0,0,1-64,0V96",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M160,96v16a32,32,0,0,1-64,0V96",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M224,96v16a32,32,0,0,1-64,0V96",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      )
    ]
  }
);
var Package = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M224,177.3V78.7a8.1,8.1,0,0,0-4.1-7l-88-49.5a7.8,7.8,0,0,0-7.8,0l-88,49.5a8.1,8.1,0,0,0-4.1,7v98.6a8.1,8.1,0,0,0,4.1,7l88,49.5a7.8,7.8,0,0,0,7.8,0l88-49.5A8.1,8.1,0,0,0,224,177.3Z",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "8"
        }
      ),
      /* @__PURE__ */ jsx2(
        "polyline",
        {
          fill: "none",
          points: "177 152.5 177 100.5 80 47",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "8"
        }
      ),
      /* @__PURE__ */ jsx2(
        "polyline",
        {
          fill: "none",
          points: "222.9 74.6 128.9 128 33.1 74.6",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "8"
        }
      ),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "8",
          x1: "128.9",
          x2: "128",
          y1: "128",
          y2: "234.8"
        }
      )
    ]
  }
);
var HandBag = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M208.8,72H47.2a8.1,8.1,0,0,0-8,7.1L25,207.1a8,8,0,0,0,7.9,8.9H223.1a8,8,0,0,0,7.9-8.9l-14.2-128A8.1,8.1,0,0,0,208.8,72Z",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M88,104V72a40,40,0,0,1,80,0v32",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      )
    ]
  }
);
var Tag = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M122.7,25.9,42,42,25.9,122.7a8,8,0,0,0,2.2,7.2L132.5,234.3a7.9,7.9,0,0,0,11.3,0l90.5-90.5a7.9,7.9,0,0,0,0-11.3L129.9,28.1A8,8,0,0,0,122.7,25.9Z",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "16"
        }
      ),
      /* @__PURE__ */ jsx2("circle", { cx: "84", cy: "84", r: "12" })
    ]
  }
);
var Backpack = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M96,48h64a48,48,0,0,1,48,48V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V96A48,48,0,0,1,96,48Z",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M80,224V152a16,16,0,0,1,16-16h64a16,16,0,0,1,16,16v72",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M96,48V32a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V48",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      ),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12",
          x1: "112",
          x2: "144",
          y1: "88",
          y2: "88"
        }
      ),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12",
          x1: "80",
          x2: "176",
          y1: "168",
          y2: "168"
        }
      ),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12",
          x1: "144",
          x2: "144",
          y1: "168",
          y2: "184"
        }
      )
    ]
  }
);
var Newspaper = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "8",
          x1: "96",
          x2: "176",
          y1: "112",
          y2: "112"
        }
      ),
      /* @__PURE__ */ jsx2(
        "line",
        {
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "8",
          x1: "96",
          x2: "176",
          y1: "144",
          y2: "144"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M32,200a16,16,0,0,0,16-16V64a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8V184a16,16,0,0,1-16,16Z",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "8"
        }
      ),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M32,200a16,16,0,0,1-16-16h0V88",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "8"
        }
      )
    ]
  }
);
var Eye = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    fill: "currentColor",
    height: "192",
    viewBox: "0 0 256 256",
    width: "192",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx2("rect", { fill: "none", height: "256", width: "256" }),
      /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Z",
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      ),
      /* @__PURE__ */ jsx2(
        "circle",
        {
          cx: "128",
          cy: "128",
          fill: "none",
          r: "40",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "12"
        }
      )
    ]
  }
);

// src/components/icons/index.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function Icon({ name, className, ...props }) {
  let WeaverseIcon = phosphor_exports[name];
  let cls = clsx_default("wv-icon", className);
  return /* @__PURE__ */ jsx3(WeaverseIcon, { className: cls, ...props });
}

// src/components/modal/index.tsx
var modal_exports = {};
__export(modal_exports, {
  Modal: () => Modal,
  ModalClose: () => ModalClose,
  ModalContent: () => ModalContent,
  ModalHeader: () => ModalHeader,
  ModalTrigger: () => ModalTrigger
});
import { Close, Portal, Root, Trigger } from "@radix-ui/react-dialog";
import { forwardRef } from "react";

// src/components/modal/styled.ts
import { Content, Overlay, Title } from "@radix-ui/react-dialog";
import { keyframes, styled } from "@stitches/react";
var overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 }
});
var contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" }
});
var StyledOverlay = styled(Overlay, {
  display: "block !important",
  backgroundColor: "rgba(0, 0, 0, .3)",
  position: "fixed",
  zIndex: 99999,
  inset: 0,
  animation: `${overlayShow} 300ms cubic-bezier(0.16, 1, 0.3, 1)`
});
var StyledTitle = styled(Title, {
  margin: "0 0 24px",
  fontWeight: 500,
  fontSize: 24,
  "@media (max-width: 768px)": {
    margin: "0 0 16px",
    fontSize: 20
  }
});
var StyledContent = styled(Content, {
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: 24,
  animation: `${contentShow} 300ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: 99999,
  maxWidth: "90vw",
  width: "auto",
  "*": {
    maxWidth: "100%"
  },
  "&:focus": { outline: "none" },
  '&[data-size="fullscreen"]': {
    width: "100vw",
    height: "100vh",
    maxWidth: "100vw",
    borderRadius: 0
  },
  "@media (max-width: 768px)": {
    width: "90vw",
    padding: 12,
    '&[data-size="fullscreen"]': {
      width: "100vw"
    }
  }
});
var StyledCloseIcon = styled("button", {
  all: "unset",
  cursor: "pointer",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 32,
  width: 32,
  padding: 4,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgb(55, 65, 81)",
  position: "absolute",
  top: 8,
  right: 8,
  "&:hover": {
    backgroundColor: "rgba(112, 112, 112, .1)"
  },
  svg: {
    width: 24,
    height: 24
  }
});

// src/components/modal/use-open-change-effect.ts
import { WeaverseContext } from "@weaverse/react";
import { useContext, useEffect } from "react";
function useOpenChangeEffect(props) {
  let { open, defaultOpen, onOpenChange } = props;
  let rootCtx = useContext(WeaverseContext);
  let toggleRootzIndex = (open2) => {
    let { contentRootElement } = rootCtx;
    if (contentRootElement) {
      if (open2) {
        contentRootElement.classList.add("modal-open");
      } else {
        contentRootElement.classList.remove("modal-open");
      }
    }
  };
  useEffect(() => {
    let isOpen = open || defaultOpen;
    toggleRootzIndex(isOpen);
  }, [open, defaultOpen]);
  let handleOpenChange = (open2) => {
    toggleRootzIndex(open2);
    onOpenChange?.(open2);
  };
  return handleOpenChange;
}

// src/components/modal/index.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var Modal = (props) => {
  let { children, open, defaultOpen, onOpenChange, ...rest } = props;
  let handleOpenChange = useOpenChangeEffect(props);
  return /* @__PURE__ */ jsx4(
    Root,
    {
      defaultOpen,
      onOpenChange: handleOpenChange,
      open,
      ...rest,
      children
    }
  );
};
var ModalTrigger = Trigger;
var ModalHeader = forwardRef(
  (props, ref) => {
    let { children, ...rest } = props;
    return /* @__PURE__ */ jsx4(StyledTitle, { ref, ...rest, "data-wv-modal-header": true, children });
  }
);
var ModalContent = forwardRef(
  (props, ref) => {
    let { children, size, portal, ...rest } = props;
    let modalContent = /* @__PURE__ */ jsxs2(Fragment, { children: [
      /* @__PURE__ */ jsx4(StyledOverlay, {}),
      /* @__PURE__ */ jsxs2(
        StyledContent,
        {
          ...rest,
          "data-size": size,
          "data-wv-modal": true,
          onCloseAutoFocus: (e) => e.preventDefault(),
          ref,
          children: [
            /* @__PURE__ */ jsx4(ModalClose, {}),
            /* @__PURE__ */ jsx4("div", { className: "wv-modal-content", children })
          ]
        }
      )
    ] });
    if (portal) {
      return /* @__PURE__ */ jsx4(Portal, { children: modalContent });
    }
    return modalContent;
  }
);
ModalContent.defaultProps = {
  size: "auto",
  portal: false
};
var ModalClose = forwardRef(
  (props, ref) => {
    let { asChild, children, ...rest } = props;
    let closeIcon = /* @__PURE__ */ jsx4(StyledCloseIcon, { children: /* @__PURE__ */ jsx4(Icon, { name: "X" }) });
    return /* @__PURE__ */ jsx4(Close, { asChild: true, ...rest, ref, children: asChild ? children : closeIcon });
  }
);

// src/components/no-hydrate.tsx
import { useState } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
function NoHydrate({ id, getHTML, ...rest }) {
  let [html] = useState(() => {
    if (typeof document === "undefined") {
      return getHTML?.() ?? "";
    }
    let el = document.getElementById(id);
    if (!el) {
      return getHTML?.() ?? "";
    }
    return el.innerHTML;
  });
  return /* @__PURE__ */ jsx5("div", { ...rest, dangerouslySetInnerHTML: { __html: html }, id });
}

// src/components/overlay.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function Overlay2(props) {
  let { enableOverlay, overlayOpacity, className } = props;
  if (enableOverlay) {
    return /* @__PURE__ */ jsx6(
      "div",
      {
        className,
        style: {
          position: "absolute",
          inset: 0,
          display: "block",
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`
        }
      }
    );
  }
  return null;
}

// src/components/placeholder.tsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
var Placeholder = forwardRef2(
  (props, ref) => {
    let { element, className, children, ...rest } = props;
    return /* @__PURE__ */ jsxs3("div", { className, "data-wv-placeholder": true, ref, ...rest, children: [
      /* @__PURE__ */ jsx7(
        "div",
        {
          style: { fontWeight: 600, margin: "10px 0 5px", padding: "0 10px" },
          children: element
        }
      ),
      /* @__PURE__ */ jsx7(
        "div",
        {
          style: {
            margin: "5px 0 10px",
            textAlign: "center",
            padding: "0 10px"
          },
          children
        }
      )
    ] });
  }
);
var placeholder_default = Placeholder;

// src/components/slider/index.tsx
import { useKeenSlider } from "keen-slider/react";
import { useState as useState2 } from "react";

// src/components/slider/arrows.tsx
import { styled as styled2 } from "@stitches/react";
import { jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
function Arrows(props) {
  let { currentSlide, instanceRef, className, icon, offset } = props;
  let isFirst = currentSlide === 0;
  let isLast = false;
  if (instanceRef.current) {
    isLast = currentSlide === instanceRef?.current?.track?.details?.maxIdx;
  }
  let style = {
    "--offset": `${offset}px`
  };
  return /* @__PURE__ */ jsxs4(StyledArrows, { className, style, children: [
    /* @__PURE__ */ jsx8(
      "button",
      {
        className: clsx_default("arrow arrow--left", isFirst && "arrow--disabled"),
        onClick: (e) => {
          e.stopPropagation();
          instanceRef?.current?.prev();
        },
        type: "button",
        children: /* @__PURE__ */ jsx8(Icon, { name: icon === "caret" ? "CaretLeft" : "ArrowLeft" })
      }
    ),
    /* @__PURE__ */ jsx8(
      "button",
      {
        className: clsx_default("arrow arrow--right", isLast && "arrow--disabled"),
        onClick: (e) => {
          e.stopPropagation();
          instanceRef?.current?.next();
        },
        type: "button",
        children: /* @__PURE__ */ jsx8(Icon, { name: icon === "caret" ? "CaretRight" : "ArrowRight" })
      }
    )
  ] });
}
var StyledArrows = styled2("div", {
  ".arrow": {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "44px",
    height: "44px",
    padding: "8px",
    color: "#191919",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    transition: "all 0.2s ease-in-out",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#191919",
      color: "#f2f2f2"
    },
    svg: {
      verticalAlign: "middle",
      width: "22px",
      height: "22px"
    },
    "&.arrow--left": {
      left: "var(--offset, 0px)"
    },
    "&.arrow--right": {
      right: "var(--offset, 0px)"
    },
    "&.arrow--disabled": {
      opacity: 0.5
    }
  },
  "@media (max-width: 768px)": {
    ".arrow": {
      display: "none"
    }
  }
});

// src/components/slider/resize-plugin.ts
var ResizePlugin = (slider) => {
  let observer = new ResizeObserver(() => slider.update());
  slider.on("created", () => {
    observer.observe(slider.container);
  });
  slider.on("destroyed", () => {
    observer.unobserve(slider.container);
  });
};

// src/components/slider/index.tsx
import { Fragment as Fragment2, jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
function Slider(props) {
  let { children, className, gap, slidesPerView, arrowOffset } = props;
  let [currentSlide, setCurrentSlide] = useState2(0);
  let [created, setCreated] = useState2(false);
  let [ref, instanceRef] = useKeenSlider(
    {
      slides: { perView: slidesPerView, spacing: gap },
      breakpoints: {
        "(max-width: 1024px)": {
          slides: { perView: 3, spacing: gap }
        },
        "(max-width: 768px)": {
          slides: {
            perView: 1,
            spacing: 32
          }
        }
      },
      created: () => {
        setCreated(true);
      },
      slideChanged: (slider) => {
        setCurrentSlide(slider.track.details.rel);
      }
    },
    [ResizePlugin]
  );
  let _className = clsx_default("keen-slider", className);
  let arrowsClass = clsx_default(className && `${className}-arrows`);
  return /* @__PURE__ */ jsxs5(Fragment2, { children: [
    /* @__PURE__ */ jsxs5("div", { className: _className, ref, children: [
      /* @__PURE__ */ jsx9(
        "link",
        {
          href: "https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css",
          rel: "stylesheet"
        }
      ),
      children
    ] }),
    created && instanceRef?.current && /* @__PURE__ */ jsx9(
      Arrows,
      {
        className: arrowsClass,
        currentSlide,
        icon: "arrow",
        instanceRef,
        offset: arrowOffset
      }
    )
  ] });
}

// src/components/slider/autoplay-plugin.ts
function AutoplayPlugin(changeSlidesEvery) {
  return (slider) => {
    let timeout;
    let mouseOver = false;
    function clearNextTimeout() {
      clearTimeout(timeout);
    }
    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) {
        return;
      }
      timeout = setTimeout(() => {
        slider.next();
      }, changeSlidesEvery * 1e3);
    }
    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  };
}

// src/components/slider/dots.tsx
import { styled as styled3 } from "@stitches/react";
import { jsx as jsx10 } from "react/jsx-runtime";
function Dots(props) {
  let { currentSlide, instanceRef, className, absolute, position, color } = props;
  let _className = clsx_default(
    className,
    absolute && "dots--absolute",
    position && `dots--${position}`,
    color && `dots--${color}`
  );
  return /* @__PURE__ */ jsx10(StyledDots, { className: _className, children: [
    ...new Array(instanceRef.current?.track.details.slides.length).keys()
  ].map((idx) => {
    let className2 = clsx_default("dot", currentSlide === idx && "dot--active");
    return /* @__PURE__ */ jsx10(
      "button",
      {
        className: className2,
        onClick: () => instanceRef.current?.moveToIdx(idx),
        type: "button"
      },
      idx
    );
  }) });
}
var StyledDots = styled3("div", {
  padding: "10px 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  "&.dots--absolute": {
    position: "absolute",
    "&.dots--top, &.dots--bottom": { left: 0, right: 0 },
    "&.dots--top": { top: 10 },
    "&.dots--bottom": { bottom: 10 },
    "&.dots--left, &.dots--right": {
      top: 0,
      bottom: 0,
      flexDirection: "column"
    },
    "&.dots--left": { left: 20 },
    "&.dots--right": { right: 20 }
  },
  "&.dots--light": {
    ".dot": {
      backgroundColor: "#ffffff66",
      "&.dot--active": {
        backgroundColor: "#ffffff"
      }
    }
  },
  "&.dots--dark": {
    ".dot": {
      backgroundColor: "#00000033",
      "&.dot--active": {
        backgroundColor: "#000000"
      }
    }
  },
  ".dot": {
    width: "9px",
    height: "9px",
    padding: "0",
    border: "none",
    borderRadius: "50%",
    transition: "all 0.2s ease-in-out"
  }
});

// src/components/spinner.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
function Spinner() {
  return /* @__PURE__ */ jsx11("span", { className: "wv-spinner-wrapper", children: /* @__PURE__ */ jsx11(Icon, { className: "wv-spinner", name: "CircleNotch" }) });
}

// src/components/tooltip.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
function Tooltip({ children }) {
  return /* @__PURE__ */ jsx12("span", { className: "wv-tooltip", children });
}

// src/components/index.ts
var Components = {
  Background,
  Icon,
  ModalComponents: modal_exports,
  Overlay: Overlay2,
  Placeholder: placeholder_default,
  Spinner,
  Slider,
  Tooltip,
  NoHydrate
};
var SliderComponents = {
  Arrows,
  Dots,
  ResizePlugin,
  AutoplayPlugin
};

// src/elements/third-party.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
var NoHydrate2 = Components.NoHydrate;
var Placeholder2 = Components.Placeholder;
var ThirdParty = forwardRef3((props, ref) => {
  let { snippet_code, information, placeholder, ...rest } = props;
  let id = rest["data-wv-id"];
  let { isDesignMode } = useContext2(WeaverseContext2);
  if (isDesignMode) {
    return /* @__PURE__ */ jsx13("div", { ref, ...rest, children: /* @__PURE__ */ jsx13(Placeholder2, { element: placeholder.name, children: placeholder.content }) });
  }
  return /* @__PURE__ */ jsx13("div", { ref, ...rest, children: /* @__PURE__ */ jsx13(NoHydrate2, { getHTML: () => snippet_code, id }) });
});
var css = {
  "@desktop": {
    "> *": {
      pointerEvents: "var(--pointer-events, unset)"
    }
  }
};
var third_party_default = ThirdParty;

// src/constant/index.ts
var TIMES = ["days", "hours", "minutes", "seconds"];
var COUNTDOWN_KEY = "wv-cd-evergreen-start";
var INSTAGRAM_API = "https://graph.instagram.com";
var DEFAULT_OPTION_DESIGN = "dropdown";
var PRODUCT_IMAGE_PLACEHOLDER = "https://ucarecdn.com/6a10905d-7ddb-4194-a32c-a4e4e2097019/-/preview/-/quality/smart/-/format/auto/";
var DEFAULT_INTEGRATIONS = [
  {
    elements: [
      {
        type: "dingdoong_date_picker",
        title: "Date Picker"
      }
    ]
  }
];

// src/elements/article-list/index.tsx
import { forwardRef as forwardRef4 } from "react";

// src/hooks/use-weaverse-shopify.ts
import { useWeaverse } from "@weaverse/react";
function useWeaverseShopify() {
  let weaverse = useWeaverse();
  return weaverse;
}

// src/proxy.ts
function createProxy(obj) {
  return new Proxy(globalThis?.[obj] || {}, {
    get(target, prop) {
      return target?.[prop] || globalThis?.[obj]?.[prop];
    }
  });
}
var weaverseShopifyConfigs = createProxy("weaverseShopifyConfigs");
var weaverseShopifyProducts = createProxy("weaverseShopifyProducts");
var weaverseShopifyProductsByCollection = createProxy(
  "weaverseShopifyProductsByCollection"
);
var weaverseShopifyCollections = createProxy(
  "weaverseShopifyCollections"
);
var weaverseShopifyArticlesByBlog = createProxy(
  "weaverseShopifyArticlesByBlog"
);
var weaverseShopifyArticles = createProxy("weaverseShopifyArticles");

// src/elements/article-list/article-card.tsx
import { jsx as jsx14, jsxs as jsxs6 } from "react/jsx-runtime";
function ArticleCard(props) {
  let {
    article,
    imageAspectRatio,
    zoomInOnHover,
    showDate,
    showAuthor,
    showExcerpt,
    excerptLineClamp,
    showReadMoreButton,
    readMoreButtonText,
    className
  } = props;
  let { title, excerpt, summary_html, author, published_at, image, url } = article;
  let style = {
    "--image-aspect-ratio": imageAspectRatio === "auto" ? "1/1" : imageAspectRatio
  };
  let cardClass = clsx_default(
    "wv-article-card",
    zoomInOnHover && "zoom-in-on-hover",
    className
  );
  let excerptStyle = {
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: excerptLineClamp
  };
  let imageSrc = typeof image === "string" ? image : image?.src;
  let imageAltText = typeof image === "string" ? title : image?.alt || title;
  let articleSummary = excerpt || summary_html;
  return /* @__PURE__ */ jsxs6("div", { className: cardClass, style, children: [
    /* @__PURE__ */ jsxs6("a", { href: url, target: "_self", children: [
      image && /* @__PURE__ */ jsx14("div", { className: "wv-article-card__image", children: /* @__PURE__ */ jsx14(
        "img",
        {
          alt: imageAltText,
          height: "1600",
          loading: "lazy",
          sizes: "(min-width: 1200px) 366px, (min-width: 750px) calc((100vw - 10rem) / 2), calc(100vw - 3rem)",
          src: `${imageSrc}&width=1500`,
          srcSet: `
                ${imageSrc}&width=165 165w,
                ${imageSrc}&width=330 330w,
                ${imageSrc}&width=535 535w,
                ${imageSrc}&width=750 750w,
                ${imageSrc}&width=1000 1000w,
                ${imageSrc} 1200w
              `,
          width: "1200"
        }
      ) }),
      /* @__PURE__ */ jsxs6("div", { className: "wv-article-card__content", children: [
        /* @__PURE__ */ jsxs6("div", { className: "wv-article-card__info", children: [
          showDate && /* @__PURE__ */ jsx14("div", { className: "wv-article-card__date", children: published_at }),
          showAuthor && /* @__PURE__ */ jsx14("div", { className: "wv-article-card__author", children: author })
        ] }),
        /* @__PURE__ */ jsx14("h3", { className: "wv-article-card__title", children: title }),
        showExcerpt && articleSummary && /* @__PURE__ */ jsx14("div", { className: "wv-article-card__excerpt", style: excerptStyle, children: /* @__PURE__ */ jsx14(
          "div",
          {
            className: "wv-article-card__excerpt-text",
            dangerouslySetInnerHTML: { __html: articleSummary }
          }
        ) })
      ] })
    ] }),
    showReadMoreButton && readMoreButtonText && /* @__PURE__ */ jsx14("a", { className: "wv-article-card__read-more", href: url, target: "_self", children: readMoreButtonText })
  ] });
}
var css2 = {
  "@desktop": {
    ".wv-article-card": {
      textDecoration: "none",
      padding: "16px",
      cursor: "pointer",
      a: {
        textDecoration: "none"
      },
      ".wv-article-card__image": {
        position: "relative",
        display: "block",
        width: "100%",
        overflow: "hidden",
        aspectRatio: "var(--image-aspect-ratio, auto)",
        borderRadius: "6px",
        img: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease"
        }
      },
      "&.zoom-in-on-hover": {
        "&:hover": {
          ".wv-article-card__image": {
            img: {
              transform: "scale(1.05)"
            }
          }
        }
      },
      ".wv-article-card__content": {
        marginTop: "20px",
        ".wv-article-card__info": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "14px",
          color: "#363535"
        },
        ".wv-article-card__title": {
          margin: "12px 0px",
          fontWeight: 500,
          fontSize: "18px",
          lineHeight: "22px",
          color: "#222222",
          "&:hover": {
            textDecoration: "underline",
            textUnderlineOffset: "2px"
          }
        },
        ".wv-article-card__excerpt": {
          overflow: "hidden",
          display: "-webkit-box",
          marginTop: "8px",
          fontSize: "15px",
          lineHeight: "1.4",
          color: "rgb(34, 34, 34, .75)"
        }
      },
      ".wv-article-card__read-more": {
        marginTop: "16px",
        position: "relative",
        padding: "2px 0",
        height: "auto",
        lineHeight: "1.25rem",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: ".3s all",
        background: "none",
        color: "#222222",
        whiteSpace: "nowrap",
        fontSize: "15px",
        fontWeight: "500",
        textDecoration: "underline",
        textUnderlineOffset: "4px",
        "&:hover": {
          color: "#222222c7"
        }
      }
    }
  },
  "@mobile": {
    ".wv-article-card": {
      textDecoration: "none",
      width: "80vw",
      scrollSnapAlign: "start",
      flex: "0 0 auto",
      padding: "8px"
    }
  }
};

// src/elements/article-list/skeleton.tsx
import { Fragment as Fragment3, jsx as jsx15, jsxs as jsxs7 } from "react/jsx-runtime";
var { Icon: Icon2 } = Components;
function Skeleton(props) {
  let { articleCount, imageAspectRatio } = props;
  let aspectRatio = imageAspectRatio === "auto" ? "1/1" : imageAspectRatio;
  let style = {
    "--image-aspect-ratio": aspectRatio
  };
  return /* @__PURE__ */ jsx15(Fragment3, { children: Array.from({ length: articleCount }).map((_, index) => /* @__PURE__ */ jsxs7(
    "div",
    {
      className: "wv-article-card-skeleton animate-pulse",
      style,
      children: [
        /* @__PURE__ */ jsx15("div", { className: "wv-article-card-skeleton__image", children: /* @__PURE__ */ jsx15(Icon2, { name: "Newspaper" }) }),
        /* @__PURE__ */ jsxs7("div", { className: "wv-article-card__info", children: [
          /* @__PURE__ */ jsx15("div", { className: "wv-article-card__date" }),
          /* @__PURE__ */ jsx15("div", { className: "wv-article-card__author" })
        ] }),
        /* @__PURE__ */ jsx15("div", { className: "wv-article-card-skeleton__title" }),
        /* @__PURE__ */ jsx15("div", { className: "wv-article-card__readmore" })
      ]
    },
    index
  )) });
}
var css3 = {
  "@desktop": {
    ".wv-article-card-skeleton": {
      display: "block",
      width: "100%",
      padding: "16px",
      ".wv-article-card-skeleton__image": {
        aspectRatio: "var(--image-aspect-ratio, auto)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D1D5DB",
        borderRadius: "4px",
        svg: { width: "48px", height: "48px", color: "#FFFFFF" }
      },
      ".wv-article-card__info": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "12px 0",
        ".wv-article-card__date, .wv-article-card__author": {
          height: "12px",
          display: "block",
          backgroundColor: "#D1D5DB",
          borderRadius: "2px",
          width: "30%"
        }
      },
      ".wv-article-card-skeleton__title": {
        display: "block",
        height: "20px",
        backgroundColor: "#D1D5DB",
        borderRadius: "4px",
        margin: "12px 0"
      },
      ".wv-article-card__readmore": {
        display: "block",
        height: "20px",
        backgroundColor: "#D1D5DB",
        borderRadius: "4px",
        margin: "16px 0",
        width: "40%"
      }
    }
  },
  "@mobile": {
    ".wv-article-card-skeleton": {
      textDecoration: "none",
      width: "80vw",
      scrollSnapAlign: "start",
      flex: "0 0 auto",
      padding: "8px"
    }
  }
};

// src/elements/article-list/index.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
var { Placeholder: Placeholder3, Slider: Slider2 } = Components;
var ArticleList = forwardRef4((props, ref) => {
  let {
    blogId,
    blogHandle,
    layout,
    articleCount,
    articlesPerRow,
    gap,
    imageAspectRatio,
    zoomInOnHover,
    showDate,
    dateFormat,
    showAuthor,
    showExcerpt,
    excerptLineClamp,
    showReadMoreButton,
    readMoreButtonText,
    children,
    ...rest
  } = props;
  let { ssrMode } = useWeaverseShopify();
  let articleIds = weaverseShopifyArticlesByBlog[blogId] || [];
  let articles = articleIds.map(
    (id) => weaverseShopifyArticles[id]
  );
  if (!blogId) {
    return /* @__PURE__ */ jsx16("div", { ref, ...rest, children: /* @__PURE__ */ jsx16(Placeholder3, { element: "Article List", children: "Select a blog and start editing." }) });
  }
  let rows = Math.ceil(articles.length / articlesPerRow);
  let shouldRenderSkeleton = ssrMode || !articles.length;
  let display = "grid";
  let overflow = "hidden";
  if (!shouldRenderSkeleton && layout === "slider") {
    display = "block";
    overflow = "0";
  }
  let style = {
    "--display": display,
    "--overflow": overflow,
    "--gap": `${gap}px`,
    "--article-per-row": articlesPerRow,
    "--rows": rows
  };
  if (shouldRenderSkeleton) {
    return /* @__PURE__ */ jsx16("div", { ref, ...rest, style, children: /* @__PURE__ */ jsx16(
      Skeleton,
      {
        articleCount: layout === "slider" ? articlesPerRow : articleCount,
        imageAspectRatio
      }
    ) });
  }
  let collectionCards = articles.slice(0, articleCount).map((article) => /* @__PURE__ */ jsx16(
    ArticleCard,
    {
      article,
      className: layout === "slider" ? "keen-slider__slide" : "",
      excerptLineClamp,
      imageAspectRatio,
      readMoreButtonText,
      showAuthor,
      showDate,
      showExcerpt,
      showReadMoreButton,
      zoomInOnHover
    },
    article.id
  ));
  if (layout === "slider") {
    return /* @__PURE__ */ jsx16("div", { ref, ...rest, style, children: /* @__PURE__ */ jsx16(
      Slider2,
      {
        arrowOffset: -80,
        className: "wv-article-list__slider",
        gap,
        slidesPerView: articlesPerRow,
        children: collectionCards
      }
    ) });
  }
  return /* @__PURE__ */ jsx16("div", { ref, ...rest, style, children: collectionCards });
});
var article_list_default = ArticleList;
ArticleList.defaultProps = {
  layout: "grid",
  articleCount: 4,
  articlesPerRow: 4,
  gap: 16,
  imageAspectRatio: "auto",
  zoomInOnHover: true,
  showDate: true,
  dateFormat: "%B %d, %Y",
  showAuthor: true,
  showExcerpt: true,
  excerptLineClamp: 3,
  showReadMoreButton: true,
  readMoreButtonText: "Read more"
};
var css4 = {
  "@desktop": {
    display: "var(--display, grid)",
    gridTemplateColumns: "repeat(var(--article-per-row), 1fr)",
    gap: "var(--gap, 16px)",
    overflow: "var(--overflow, hidden)",
    position: "relative",
    ...css2["@desktop"],
    ...css3["@desktop"]
  },
  "@mobile": {
    display: "flex",
    overflow: "auto",
    scrollBehavior: "smooth",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 0,
    ".wv-article-list__slider": {
      ".wv-article-card": {
        padding: "0 32px"
      }
    },
    ...css2["@mobile"],
    ...css3["@mobile"]
  }
};

// src/elements/collection-list/index.tsx
import { forwardRef as forwardRef5 } from "react";

// src/elements/collection-list/collection-card.tsx
import { jsx as jsx17, jsxs as jsxs8 } from "react/jsx-runtime";
function CollectionCard(props) {
  let {
    collection,
    imageAspectRatio,
    showProductCount,
    zoomInOnHover,
    className
  } = props;
  let { title, products_count, featured_image, url } = collection;
  let style = {
    "--image-aspect-ratio": imageAspectRatio === "auto" ? "1/1" : imageAspectRatio
  };
  let cardClass = clsx_default(
    "wv-collection-card",
    zoomInOnHover && "zoom-in-on-hover",
    className
  );
  let imageSrc = typeof featured_image === "string" ? featured_image : featured_image?.src;
  let imageAltText = typeof featured_image === "string" ? title : featured_image?.alt || title;
  return /* @__PURE__ */ jsx17("div", { className: cardClass, style, children: /* @__PURE__ */ jsxs8("a", { href: url, target: "_self", children: [
    featured_image && /* @__PURE__ */ jsx17("div", { className: "wv-col-card__image", children: /* @__PURE__ */ jsx17(
      "img",
      {
        alt: imageAltText,
        height: "1600",
        loading: "lazy",
        sizes: "(min-width: 1200px) 366px, (min-width: 750px) calc((100vw - 10rem) / 2), calc(100vw - 3rem)",
        src: `${imageSrc}&width=1500`,
        srcSet: `
            ${imageSrc}&width=165 165w,
            ${imageSrc}&width=330 330w,
            ${imageSrc}&width=535 535w,
            ${imageSrc}&width=750 750w,
            ${imageSrc}&width=1000 1000w,
            ${imageSrc} 1200w
          `,
        width: "1200"
      }
    ) }),
    /* @__PURE__ */ jsxs8("div", { className: "wv-col-card__content", children: [
      /* @__PURE__ */ jsx17("h3", { className: "wv-col-card__title", children: title }),
      showProductCount && /* @__PURE__ */ jsxs8("p", { className: "wv-col-card__product-count", children: [
        products_count,
        " products"
      ] })
    ] })
  ] }) });
}
var css5 = {
  "@desktop": {
    ".wv-collection-card": {
      a: {
        textDecoration: "none"
      },
      padding: "16px",
      cursor: "pointer",
      ".wv-col-card__image": {
        position: "relative",
        display: "block",
        width: "100%",
        overflow: "hidden",
        aspectRatio: "var(--image-aspect-ratio, auto)",
        borderRadius: "6px",
        img: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease"
        }
      },
      "&.zoom-in-on-hover": {
        "&:hover": {
          ".wv-col-card__image": {
            img: {
              transform: "scale(1.05)"
            }
          }
        }
      },
      ".wv-col-card__content": {
        marginTop: "20px",
        ".wv-col-card__title": {
          marginTop: 0,
          marginBottom: "2px",
          fontWeight: 400,
          fontSize: "24px",
          lineHeight: "34px",
          color: "#000000",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline"
          }
        },
        ".wv-col-card__product-count": {
          fontSize: "16px",
          color: "#666666",
          margin: 0
        }
      }
    }
  },
  "@mobile": {
    ".wv-collection-card": {
      textDecoration: "none",
      width: "80vw",
      scrollSnapAlign: "start",
      flex: "0 0 auto",
      padding: "8px"
    }
  }
};

// src/elements/collection-list/skeleton.tsx
import { Fragment as Fragment4, jsx as jsx18, jsxs as jsxs9 } from "react/jsx-runtime";
var { Icon: Icon3 } = Components;
function Skeleton2(props) {
  let { collectionCount, imageAspectRatio } = props;
  let aspectRatio = imageAspectRatio === "auto" ? "1/1" : imageAspectRatio;
  let style = {
    "--image-aspect-ratio": aspectRatio
  };
  return /* @__PURE__ */ jsx18(Fragment4, { children: Array.from({ length: collectionCount }).map((_, index) => /* @__PURE__ */ jsxs9(
    "div",
    {
      className: "wv-col-card-skeleton animate-pulse",
      style,
      children: [
        /* @__PURE__ */ jsx18("div", { className: "wv-col-card-skeleton__image", children: /* @__PURE__ */ jsx18(Icon3, { name: "Storefront" }) }),
        /* @__PURE__ */ jsx18("div", { className: "wv-col-card-skeleton__title" }),
        /* @__PURE__ */ jsx18("div", { className: "wv-col-card-skeleton__items-count" })
      ]
    },
    index
  )) });
}
var css6 = {
  "@desktop": {
    ".wv-col-card-skeleton": {
      display: "block",
      width: "100%",
      padding: "16px",
      ".wv-col-card-skeleton__image": {
        aspectRatio: "var(--image-aspect-ratio, auto)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D1D5DB",
        borderRadius: "4px",
        svg: { width: "48px", height: "48px", color: "#FFFFFF" }
      },
      ".wv-col-card-skeleton__title": {
        display: "block",
        height: "20px",
        backgroundColor: "#D1D5DB",
        borderRadius: "4px",
        margin: "12px 0",
        width: "80%"
      },
      ".wv-col-card-skeleton__items-count": {
        margin: "12px 0",
        height: "12px",
        display: "block",
        backgroundColor: "#D1D5DB",
        borderRadius: "2px",
        width: "30%"
      }
    }
  },
  "@mobile": {
    ".wv-col-card-skeleton": {
      textDecoration: "none",
      width: "80vw",
      scrollSnapAlign: "start",
      flex: "0 0 auto",
      padding: "8px"
    }
  }
};

// src/elements/collection-list/use-collections.ts
function useCollections(collections) {
  let collectionsInfo = collections.map(({ collectionId }) => weaverseShopifyCollections[collectionId]).filter(Boolean);
  let hasAllData = collectionsInfo.every(Boolean);
  return hasAllData ? collectionsInfo : [];
}

// src/elements/collection-list/index.tsx
import { jsx as jsx19 } from "react/jsx-runtime";
var { Placeholder: Placeholder4, Slider: Slider3 } = Components;
var CollectionList = forwardRef5(
  (props, ref) => {
    let {
      collections,
      layout,
      collectionsPerRow,
      gap,
      imageAspectRatio,
      showProductCount,
      zoomInOnHover,
      children,
      ...rest
    } = props;
    let { ssrMode } = useWeaverseShopify();
    let collectionsInfo = useCollections(collections);
    if (!collections.length) {
      return /* @__PURE__ */ jsx19("div", { ref, ...rest, children: /* @__PURE__ */ jsx19(Placeholder4, { element: "Collection List", children: "Select collections and start editing." }) });
    }
    let rows = Math.ceil(collectionsInfo.length / collectionsPerRow);
    let shouldRenderSkeleton = ssrMode || !collectionsInfo.length;
    let display = "grid";
    let overflow = "hidden";
    if (!shouldRenderSkeleton && layout === "slider") {
      display = "block";
      overflow = "0";
    }
    let style = {
      "--display": display,
      "--overflow": overflow,
      "--gap": `${gap}px`,
      "--collection-per-row": collectionsPerRow,
      "--rows": rows
    };
    if (shouldRenderSkeleton) {
      return /* @__PURE__ */ jsx19("div", { ref, ...rest, style, children: /* @__PURE__ */ jsx19(
        Skeleton2,
        {
          collectionCount: layout === "slider" ? collectionsPerRow : collections.length,
          imageAspectRatio
        }
      ) });
    }
    let collectionCards = collectionsInfo.map((collection) => /* @__PURE__ */ jsx19(
      CollectionCard,
      {
        className: layout === "slider" ? "keen-slider__slide" : "",
        collection,
        imageAspectRatio,
        showProductCount,
        zoomInOnHover
      },
      collection.id
    ));
    if (layout === "slider") {
      return /* @__PURE__ */ jsx19("div", { ref, ...rest, style, children: /* @__PURE__ */ jsx19(
        Slider3,
        {
          arrowOffset: -80,
          className: "wv-collection-list__slider",
          gap,
          slidesPerView: collectionsPerRow,
          children: collectionCards
        }
      ) });
    }
    return /* @__PURE__ */ jsx19("div", { ref, ...rest, style, children: collectionCards });
  }
);
var collection_list_default = CollectionList;
CollectionList.defaultProps = {
  collections: [],
  layout: "grid",
  collectionsPerRow: 4,
  gap: 16,
  imageAspectRatio: "auto",
  zoomInOnHover: true,
  showProductCount: true
};
var css7 = {
  "@desktop": {
    display: "var(--display, grid)",
    gridTemplateColumns: "repeat(var(--collection-per-row), 1fr)",
    gap: "var(--gap, 16px)",
    overflow: "var(--overflow, hidden)",
    position: "relative",
    ...css5["@desktop"],
    ...css6["@desktop"]
  },
  "@mobile": {
    display: "flex",
    overflow: "auto",
    scrollBehavior: "smooth",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 0,
    ".wv-collection-list__slider": {
      ".wv-collection-card": {
        padding: "0 32px"
      }
    },
    ...css5["@mobile"],
    ...css6["@mobile"]
  }
};

// src/elements/app-block.tsx
import { WeaverseContext as WeaverseContext3 } from "@weaverse/react";
import { forwardRef as forwardRef6, useContext as useContext3 } from "react";
import { jsx as jsx20 } from "react/jsx-runtime";
var { Placeholder: Placeholder5, NoHydrate: NoHydrate3 } = Components;
var AppBlock = forwardRef6(
  (props, ref) => {
    let id = props["data-wv-id"];
    let { isDesignMode } = useContext3(WeaverseContext3);
    if (isDesignMode) {
      return /* @__PURE__ */ jsx20("div", { ref, ...props, children: /* @__PURE__ */ jsx20(Placeholder5, { element: "App Block", children: "Add an App Block inside Shopify Theme Customizer to show here." }) });
    }
    return /* @__PURE__ */ jsx20("div", { ref, ...props, children: /* @__PURE__ */ jsx20(
      NoHydrate3,
      {
        getHTML: () => `
          {%- unless app_block_index -%}
            {%- assign app_block_index = 0 -%}
          {%- endunless -%}
          {%- assign block = section.blocks[app_block_index] -%}
          {%- if block -%}
            {%- case block.type -%}
              {%- when '@app' -%}
                {%- render block -%}
                {%- assign app_block_index = app_block_index | plus: 1 -%}
            {%- endcase -%}
          {%- endif -%}
        `,
        id
      }
    ) });
  }
);
var css8 = {
  "@desktop": {
    "> *": {
      pointerEvents: "var(--pointer-events, unset)"
    }
  }
};
AppBlock.defaultProps = {};
var app_block_default = AppBlock;

// src/elements/button.tsx
import { WeaverseContext as WeaverseContext4 } from "@weaverse/react";
import * as React from "react";
import { useContext as useContext4 } from "react";
import { jsx as jsx21 } from "react/jsx-runtime";
var Button = React.forwardRef((props, ref) => {
  let { isDesignMode } = useContext4(WeaverseContext4);
  let { text, clickAction, linkTo, openInNewTab, ...rest } = props;
  if (clickAction === "none") {
    return /* @__PURE__ */ jsx21("button", { ref, ...rest, children: text });
  }
  return /* @__PURE__ */ jsx21(
    "a",
    {
      href: isDesignMode ? void 0 : linkTo,
      ref,
      rel: "noreferrer",
      target: openInNewTab ? "_blank" : "_self",
      ...rest,
      children: text
    }
  );
});
Button.defaultProps = {
  type: "button",
  text: "BUTTON",
  clickAction: "none",
  linkTo: "",
  openInNewTab: false
};
var css9 = {
  "@desktop": {
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#3E3F40",
    color: "#fff",
    fontSize: "14px",
    lineHeight: "1.5",
    letterSpacing: "0",
    fontWeight: "medium",
    padding: "10px 20px",
    height: "42px",
    minWidth: "120px",
    textDecoration: "none",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#1A1B1B"
    }
  }
};
var button_default = Button;

// src/elements/container.tsx
import { Children, forwardRef as forwardRef8 } from "react";
import { jsx as jsx22 } from "react/jsx-runtime";
var Container = forwardRef8(
  (props, ref) => {
    let { children, ...rest } = props;
    return /* @__PURE__ */ jsx22("div", { ref, ...rest, children: Children.count(children) ? children : /* @__PURE__ */ jsx22(Components.Placeholder, { element: "Container", children: "Drop element here" }) });
  }
);
var css10 = {
  "@desktop": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gridArea: "1 / 1 / 3 / 6",
    overflow: "hidden",
    // minWidth: '300px',
    minHeight: "100px"
  },
  "@mobile": {
    minHeight: "100px"
  }
};
Container.defaultProps = {};
var container_default = Container;

// src/elements/countdown/index.tsx
import { WeaverseContext as WeaverseContext5 } from "@weaverse/react";
import React2, { forwardRef as forwardRef9, useContext as useContext5, useEffect as useEffect2 } from "react";

// src/utils/index.ts
function getTime(_seconds) {
  let ONE_MINUTE = 60 * 1e3;
  let ONE_HOUR = 60 * ONE_MINUTE;
  let ONE_DAY = 24 * ONE_HOUR;
  let days = Math.floor(_seconds / ONE_DAY);
  let hours = Math.floor((_seconds - days * ONE_DAY) / ONE_HOUR);
  let minutes = Math.floor(
    (_seconds - days * ONE_DAY - hours * ONE_HOUR) / ONE_MINUTE
  );
  let seconds = Math.floor(
    (_seconds - days * ONE_DAY - hours * ONE_HOUR - minutes * ONE_MINUTE) / 1e3
  );
  return { days, hours, minutes, seconds };
}
function getYoutubeEmbedId(url) {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
  );
  return match ? match[1] : null;
}
function getVimeoId(url) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(.+)/);
  return match ? match[1] : null;
}
function loadCSS(attrs) {
  return new Promise((resolve, reject) => {
    let found = document.querySelector(`link[href="${attrs.href}"]`);
    if (found) {
      return resolve(true);
    }
    let link = document.createElement("link");
    Object.assign(link, attrs);
    link.addEventListener("load", () => resolve(true));
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// src/elements/countdown/timer-block.tsx
import { jsx as jsx23, jsxs as jsxs10 } from "react/jsx-runtime";
function TimerBlock({ value, label }) {
  return /* @__PURE__ */ jsxs10("div", { className: "wv-cd-block", children: [
    /* @__PURE__ */ jsx23("div", { className: "wv-cd-number", children: typeof value === "string" ? value : value.toString().padStart(2, "0") }),
    label && /* @__PURE__ */ jsx23("div", { className: "wv-cd-label", children: label })
  ] });
}

// src/elements/countdown/index.tsx
import { jsx as jsx24, jsxs as jsxs11 } from "react/jsx-runtime";
var Countdown = forwardRef9(
  (props, ref) => {
    const { isDesignMode } = useContext5(WeaverseContext5);
    let {
      timerType,
      startTime: startTimeProp,
      endTime: endTimeProp,
      periods: periodsProp,
      redirectWhenTimerStops,
      redirectUrl,
      openInNewTab,
      showColon,
      showLabel,
      ...rest
    } = props;
    const [remaining, setRemaining] = React2.useState(0);
    let periods = periodsProp * 60 * 1e3;
    const handleEnd = () => {
      if (!isDesignMode && redirectWhenTimerStops && redirectUrl) {
        window.open(redirectUrl, openInNewTab ? "_blank" : "_self");
      }
    };
    const getStartTime = () => {
      let startTime = startTimeProp;
      if (timerType === "evergreen") {
        const start = localStorage.getItem(COUNTDOWN_KEY);
        if (start) {
          startTime = Number.parseInt(start, 10);
          if (startTime + periods < Date.now()) {
            startTime = Date.now();
            localStorage.setItem(COUNTDOWN_KEY, startTime.toString());
          }
        } else {
          startTime = Date.now();
          localStorage.setItem(COUNTDOWN_KEY, startTime.toString());
        }
      }
      return startTime;
    };
    const checkActive = (startTime) => startTime < Date.now() && endTimeProp > Date.now();
    const handleRemaining = () => {
      let startTime = getStartTime();
      let endTime = timerType === "fixed-time" ? endTimeProp : startTime + periods;
      let isActive = checkActive(startTime);
      const remainingTime = isActive ? Math.max(endTime - Date.now(), 0) : 0;
      if (remainingTime > 0 && remainingTime < 1e3) {
        handleEnd();
      }
      setRemaining(remainingTime);
    };
    useEffect2(() => {
      let intervalFlag = setInterval(
        handleRemaining,
        1e3
      );
      return () => {
        clearInterval(intervalFlag);
      };
    }, [startTimeProp, endTimeProp, periods, timerType]);
    const timer = getTime(remaining);
    return /* @__PURE__ */ jsx24("div", { ref, ...rest, children: TIMES.map((time) => /* @__PURE__ */ jsxs11(React2.Fragment, { children: [
      /* @__PURE__ */ jsx24(
        TimerBlock,
        {
          label: showLabel ? time : "",
          value: remaining === 0 ? "--" : timer[time]
        }
      ),
      time !== "seconds" && /* @__PURE__ */ jsx24("div", { className: "wv-cd-separator", children: showColon && /* @__PURE__ */ jsx24("span", { children: ":" }) })
    ] }, time)) });
  }
);
var css11 = {
  "@desktop": {
    fontSize: "36px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    justifyContent: "center",
    gap: 10,
    lineHeight: "initial",
    ".wv-cd-block": {
      textAlign: "center",
      ".wv-cd-label": {
        fontSize: 10
      }
    },
    ".wv-cd-separator": {
      span: {
        lineHeight: "100%"
      },
      ".hidden": {
        visibility: "hidden"
      }
    }
  }
};
Countdown.defaultProps = {
  timerType: "fixed-time",
  startTime: Date.now(),
  endTime: Date.now() + 1e3 * 60 * 60 * 24,
  periods: 90,
  redirectWhenTimerStops: false,
  redirectUrl: "",
  openInNewTab: false,
  showLabel: true,
  showColon: true
};
var countdown_default = Countdown;

// src/elements/custom-html.tsx
import { WeaverseContext as WeaverseContext6 } from "@weaverse/react";
import { forwardRef as forwardRef10, useContext as useContext6 } from "react";
import { jsx as jsx25, jsxs as jsxs12 } from "react/jsx-runtime";
var { Placeholder: Placeholder6, NoHydrate: NoHydrate4 } = Components;
var CustomHTML = forwardRef10(
  (props, ref) => {
    let { content, children, ...rest } = props;
    let id = rest["data-wv-id"];
    let { isDesignMode } = useContext6(WeaverseContext6);
    let style = {
      "--pointer-events": isDesignMode ? "none" : "auto"
    };
    if (!content) {
      return /* @__PURE__ */ jsx25("div", { ref, ...rest, children: /* @__PURE__ */ jsxs12(Placeholder6, { element: "Custom HTML", children: [
        "Click ",
        /* @__PURE__ */ jsx25("strong", { children: "Add code" }),
        " to add your custom HTML & Liquid."
      ] }) });
    }
    return /* @__PURE__ */ jsx25("div", { ref, ...rest, style, children: isDesignMode ? content : /* @__PURE__ */ jsx25(NoHydrate4, { getHTML: () => content, id }) });
  }
);
var css12 = {
  "@desktop": {
    minHeight: "100px",
    "> *": {
      pointerEvents: "var(--pointer-events, unset)"
    }
  }
};
CustomHTML.defaultProps = {
  content: ""
};
var custom_html_default = CustomHTML;

// src/elements/form/index.tsx
import { forwardRef as forwardRef11, useId } from "react";

// src/elements/form/form-field.tsx
import { jsx as jsx26, jsxs as jsxs13 } from "react/jsx-runtime";
function FormField({ field, formId }) {
  let fieldName = `contact[${field.name || field.label}]`;
  return /* @__PURE__ */ jsxs13("div", { className: "wv-form-field", children: [
    /* @__PURE__ */ jsx26("label", { className: "wv-form-field__label", htmlFor: fieldName, children: field.label }),
    field.type !== "multiline" ? /* @__PURE__ */ jsx26(
      "input",
      {
        form: formId,
        name: fieldName,
        placeholder: field.placeholder,
        required: field.required,
        type: field.type
      }
    ) : /* @__PURE__ */ jsx26(
      "textarea",
      {
        form: formId,
        name: fieldName,
        placeholder: field.placeholder,
        required: field.required,
        rows: 4
      }
    )
  ] });
}

// src/elements/form/index.tsx
import { jsx as jsx27, jsxs as jsxs14 } from "react/jsx-runtime";
var Form = forwardRef11((props, ref) => {
  let { ssrMode } = useWeaverseShopify();
  let {
    fields,
    formType,
    submitText,
    submitPosition,
    targetLink,
    openInNewTab,
    ...rest
  } = props;
  let formId = useId();
  let style = {
    "--wv-form-submit-align": submitPosition
  };
  let formContent = /* @__PURE__ */ jsx27("div", { ref, ...rest, style, children: /* @__PURE__ */ jsxs14(
    "form",
    {
      acceptCharset: "UTF-8",
      action: "/contact#contact_form",
      className: "contact-form wv-form",
      id: formId,
      method: "post",
      children: [
        /* @__PURE__ */ jsx27("input", { name: "form_type", type: "hidden", value: formType }),
        /* @__PURE__ */ jsx27("input", { name: "utf8", type: "hidden", value: "\u2713" }),
        fields.map((field) => /* @__PURE__ */ jsx27(FormField, { field, formId }, field.id)),
        /* @__PURE__ */ jsx27("button", { className: "wv-form__submit", type: "submit", children: submitText })
      ]
    }
  ) });
  if (ssrMode) {
    return /* @__PURE__ */ jsxs14("div", { ref, ...rest, style, children: [
      `{% form '${formType}' %}`,
      " {% if form.posted_successfully? %} ",
      `<h3>{% render 'icon-success' %}{{ 'newsletter.success' | t }}</h3>`,
      targetLink && /* @__PURE__ */ jsx27(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `window.open(${targetLink},${openInNewTab ? "_blank" : "_self"})`
          }
        }
      ),
      " {%- endif -%} ",
      "{% if form.errors %}",
      "<p>{{ form.errors | default_errors }}</p>",
      "{% endif %}",
      formContent,
      "{% endform %}"
    ] });
  }
  return formContent;
});
Form.defaultProps = {
  formType: "customer",
  fields: [
    {
      id: "field-1",
      type: "text",
      placeholder: "Enter your name",
      showLabel: true,
      label: "Your name",
      name: "first_name",
      required: false
    },
    {
      id: "field-2",
      showLabel: true,
      label: "Your email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      required: true
    },
    {
      id: "field-3",
      showLabel: true,
      label: "Your message",
      name: "message",
      type: "multiline",
      placeholder: "Enter your message",
      required: false
    }
  ],
  submitText: "Submit",
  submitPosition: "center",
  openInNewTab: true,
  targetLink: "https://myshop.com"
};
var css13 = {
  "@desktop": {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    width: "100%",
    padding: "12px",
    ".wv-form": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      ".wv-form-field": {
        display: "flex",
        flexDirection: "column",
        marginBottom: 12,
        ".wv-form-field__label": {
          marginBottom: 4
        },
        "input, textarea": {
          px: 12,
          py: 10,
          border: "1px solid #ddd"
        }
      },
      ".wv-form__submit": {
        alignSelf: "var(--wv-form-submit-align, flex-start)",
        background: "#4B5563",
        color: "#fff",
        padding: "14px 30px",
        border: "none",
        width: "fit-content"
      }
    }
  }
};
var form_default = Form;

// src/elements/hotspots.tsx
import { forwardRef as forwardRef12 } from "react";

// src/elements/product/product-media/image.tsx
import React3 from "react";
import { Fragment as Fragment5, jsx as jsx28, jsxs as jsxs15 } from "react/jsx-runtime";
function Image2(props) {
  let { image, width, className, onLoad, onClick } = props;
  let [loaded, setLoaded] = React3.useState(false);
  let _class = clsx_default("wv-image", loaded && "image-loaded", className);
  return /* @__PURE__ */ jsxs15(Fragment5, { children: [
    /* @__PURE__ */ jsx28(
      "img",
      {
        alt: image.alt || "",
        className: _class,
        height: image.height,
        loading: "lazy",
        onClick,
        onLoad: (e) => {
          setLoaded(true);
          onLoad?.(e);
        },
        sizes: "(min-width: 1200px) calc((1200px - 10rem) / 2), (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)",
        src: `${image.src}&crop=center&width=${width}`,
        srcSet: `
          ${image.src}&width=550 550w,
          ${image.src}&width=1100 1100w,
          ${image.src}&width=1445 1445w,
          ${image.src}&width=1680 1680w,
          ${image.src}&width=2048 2048w,
          ${image.src} 2256w
        `,
        width: image.width
      }
    ),
    /* @__PURE__ */ jsx28(
      "noscript",
      {
        dangerouslySetInnerHTML: {
          __html: `<img src="${image.src}&width=${width}" alt="${image.alt}"/>`
        }
      }
    )
  ] });
}

// src/utils/money.ts
var defaultMoneyFormat = "${{amount}}";
function formatMoney(cents, format) {
  if (typeof cents === "string") {
    cents = cents.replace(".", "");
  }
  let value = "";
  let placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  let formatString = format || defaultMoneyFormat;
  function formatWithDelimiters(number, precision = 2, thousands = ",", decimal = ".") {
    if (Number.isNaN(number) || number == null) {
      return 0;
    }
    number = (number / 100).toFixed(precision);
    let parts = number.split(".");
    let dollarsAmount = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`
    );
    let centsAmount = parts[1] ? decimal + parts[1] : "";
    return dollarsAmount + centsAmount;
  }
  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }
  return formatString.replace(placeholderRegex, value);
}

// src/elements/hotspots.tsx
import { jsx as jsx29, jsxs as jsxs16 } from "react/jsx-runtime";
var { Icon: Icon4 } = Components;
var Hotspots = forwardRef12(
  (props, ref) => {
    let { image, aspectRatio, icon, color, hotspots, ...rest } = props;
    let { money_format } = weaverseShopifyConfigs.shopData || {};
    let products = hotspots.filter((hotspot) => hotspot.productId).map((hotspot) => weaverseShopifyProducts[hotspot.productId]);
    let style = {
      "--aspect-ratio": aspectRatio,
      "--color": color === "light" ? "#000" : "#fff",
      "--bg-color": color === "light" ? "#fff" : "#000"
    };
    return /* @__PURE__ */ jsxs16("div", { ref, ...rest, style, children: [
      /* @__PURE__ */ jsx29(
        "img",
        {
          alt: "Hotspots",
          className: "hotspots__image",
          loading: "lazy",
          src: image
        }
      ),
      /* @__PURE__ */ jsx29("div", { className: "hotspots", children: hotspots.map((hotspot) => {
        let product = products.find(
          (product2) => product2?.id === hotspot.productId
        );
        if (!product) {
          return null;
        }
        let { images, url, price, title } = product;
        return /* @__PURE__ */ jsxs16(
          "div",
          {
            className: "hotspots__button animate-ping",
            style: {
              top: `${hotspot.offsetY}%`,
              left: `${hotspot.offsetX}%`,
              "--translate-x-ratio": hotspot.offsetX > 50 ? 1 : -1,
              "--translate-y-ratio": hotspot.offsetY > 50 ? 1 : -1
            },
            children: [
              /* @__PURE__ */ jsx29(Icon4, { name: icon }),
              /* @__PURE__ */ jsxs16(
                "div",
                {
                  className: "hotspot__product",
                  style: {
                    top: hotspot.offsetY > 50 ? "auto" : "100%",
                    bottom: hotspot.offsetY > 50 ? "100%" : "auto",
                    left: hotspot.offsetX > 50 ? "auto" : "100%",
                    right: hotspot.offsetX > 50 ? "100%" : "auto"
                  },
                  children: [
                    /* @__PURE__ */ jsx29("div", { className: "hotspot__product-image", children: /* @__PURE__ */ jsx29("a", { href: url, target: "_self", children: /* @__PURE__ */ jsx29(Image2, { image: images[0], width: 500 }) }) }),
                    /* @__PURE__ */ jsxs16("div", { className: "hotspot__product-info", children: [
                      /* @__PURE__ */ jsxs16("div", { children: [
                        /* @__PURE__ */ jsx29("a", { className: "hotspot__product-title", href: url, children: title }),
                        /* @__PURE__ */ jsx29("p", { className: "hotspot__product-price", children: formatMoney(price, money_format) })
                      ] }),
                      /* @__PURE__ */ jsx29("a", { className: "hotspot__view-details", href: url, children: "View full details" })
                    ] })
                  ]
                }
              )
            ]
          },
          hotspot.productId
        );
      }) })
    ] });
  }
);
var css14 = {
  "@desktop": {
    position: "relative",
    display: "flex",
    ".hotspots__image": {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    ".hotspots__button": {
      position: "absolute",
      display: "flex",
      width: "28px",
      height: "28px",
      padding: "5px",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "var(--bg-color)",
      color: "var(--color)",
      cursor: "pointer",
      svg: {
        width: "18px",
        height: "18px"
      },
      "&:hover": {
        ".hotspot__product": {
          opacity: "1",
          visibility: "visible",
          transform: "translate3d(calc(var(--translate-x-ratio) * 28px), calc(var(--translate-y-ratio) * -6px), 0)"
        }
      },
      ".hotspot__product": {
        width: "280px",
        padding: "16px",
        backgroundColor: "#fff",
        overflow: "hidden",
        transition: ".3s all",
        opacity: "0",
        visibility: "hidden",
        transform: "translate3d(calc(var(--translate-x-ratio) * 28px), calc(var(--translate-y-ratio) * -16px), 0)",
        boxShadow: "2px 7px 15px rgba(0, 0, 0, .04)",
        position: "absolute",
        display: "flex",
        gap: "16px",
        ".hotspot__product-image": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          a: {
            width: "80px",
            display: "flex",
            img: {
              width: "100%",
              height: "auto",
              objectFit: "contain",
              objectPosition: "center"
            }
          }
        },
        ".hotspot__product-info": {
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          ".hotspot__product-title": {
            display: "flex",
            fontSize: "14px",
            lineHeight: "1.5",
            fontWeight: "600",
            color: "#222",
            textDecoration: "none",
            textTransform: "uppercase"
          },
          ".hotspot__product-price": {
            fontSize: "15px",
            fontWeight: "500",
            marginTop: "8px",
            marginBottom: "10px",
            color: "#222"
          },
          ".hotspot__view-details": {
            fontSize: "14px",
            fontWeight: "600",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
            justifySelf: "flex-end",
            color: "#222"
          }
        }
      }
    }
  },
  "@mobile": {
    aspectRatio: "var(--aspect-ratio, 1/1)",
    ".hotspots__button": {
      ".hotspot__product": {
        flexDirection: "column",
        width: "150px"
      }
    }
  }
};
Hotspots.defaultProps = {
  image: "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Integration.png?v=1698317519",
  aspectRatio: "auto",
  icon: "HandBag",
  color: "light",
  hotspots: [
    {
      id: "default",
      productId: null,
      productHandle: "",
      offsetX: 50,
      offsetY: 50
    }
  ]
};
var hotspots_default = Hotspots;

// src/elements/image.tsx
import React4 from "react";
import { jsx as jsx30 } from "react/jsx-runtime";
var Image3 = React4.forwardRef(
  (props, ref) => {
    let {
      src,
      alt,
      objectFit,
      objectPosition,
      clickAction,
      openInNewTab,
      linkTo,
      ...rest
    } = props;
    let style = {
      "--img-object-fit": objectFit,
      "--img-object-position": objectPosition
    };
    if (src?.includes("ucarecdn.com") && src?.endsWith("/")) {
      src = `${src}-/preview/-/quality/smart/-/format/auto/`;
    }
    let content = /* @__PURE__ */ jsx30("img", { alt, loading: "lazy", src });
    if (clickAction === "openLink" && linkTo) {
      content = /* @__PURE__ */ jsx30(
        "a",
        {
          href: linkTo,
          rel: "noreferrer",
          target: openInNewTab ? "_blank" : "_self",
          children: /* @__PURE__ */ jsx30("img", { alt, loading: "lazy", src })
        }
      );
    }
    return /* @__PURE__ */ jsx30("div", { ref, ...rest, style, children: content });
  }
);
var css15 = {
  "@desktop": {
    display: "flex",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    img: {
      width: "100%",
      height: "100%",
      objectFit: "var(--img-object-fit, cover)",
      objectPosition: "var(--img-object-position, center)"
    }
  }
};
Image3.defaultProps = {
  src: "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Integration.png?v=1698317519",
  alt: "Alternative information",
  objectFit: "cover",
  objectPosition: "center center",
  clickAction: "none",
  openInNewTab: false,
  linkTo: ""
};
var image_default = Image3;

// src/elements/instagram.tsx
import { forwardRef as forwardRef13, useEffect as useEffect3, useState as useState3 } from "react";
import { jsx as jsx31 } from "react/jsx-runtime";
var Instagram = forwardRef13(
  (props, ref) => {
    let { token, username, numberOfImages, imagesPerRow, gap, ...rest } = props;
    let [media, setMedia] = useState3([]);
    let [error, setError] = useState3(null);
    useEffect3(() => {
      if (token) {
        let params = new URLSearchParams({
          access_token: token,
          fields: "id,media_type,caption,media_url,permalink,thumbnail_url"
        });
        fetch(`${INSTAGRAM_API}/me/media?${params.toString()}`).then((res) => res.json()).then((res) => {
          if (res.error) {
            setError(res);
          } else {
            setError(null);
            setMedia([...res.data]);
          }
        }).catch(setError);
      }
    }, [token]);
    if (!token || error) {
      return /* @__PURE__ */ jsx31("div", { ref, ...rest, children: /* @__PURE__ */ jsx31(Components.Placeholder, { element: "Instagram", children: token ? "Invalid or expired token!" : "Connect to Instagram to display photos on your site." }) });
    }
    let style = {
      "--wv-ig-images-per-row": imagesPerRow,
      "--wv-ig-images-gap": `${gap}px`
    };
    return /* @__PURE__ */ jsx31("div", { ref, ...rest, style, children: /* @__PURE__ */ jsx31("div", { className: "wv-ig-media-container", children: media.slice(0, numberOfImages).map((item) => {
      let {
        id,
        permalink,
        caption,
        media_url,
        media_type,
        thumbnail_url
      } = item;
      if (media_type === "VIDEO") {
        return (
          // biome-ignore lint/a11y/useMediaCaption: <explanation>
          /* @__PURE__ */ jsx31("video", { controls: true, poster: thumbnail_url, children: /* @__PURE__ */ jsx31("source", { src: media_url, type: "video/mp4" }) }, id)
        );
      }
      return /* @__PURE__ */ jsx31("a", { href: permalink, rel: "noreferrer", target: "_blank", children: /* @__PURE__ */ jsx31("img", { alt: caption, src: media_url }) }, id);
    }) }) });
  }
);
var css16 = {
  // '@desktop': {
  //   '.wv-ig-media-container': {
  //     overflow: 'hidden',
  //     maxWidth: '100%',
  //     maxHeight: '100%',
  //     display: 'grid',
  //     gridTemplateColumns: 'repeat(var(--wv-ig-images-per-row, 4), 1fr)',
  //     gap: 'var(--wv-ig-images-gap, 0px)',
  //     img: {
  //       // aspectRatio: '1 / 1',
  //       maxWidth: '100%',
  //       maxHeight: '100%',
  //       objectFit: 'cover',
  //     },
  //   },
  // },
};
var permanentCss = {
  "@desktop": {
    ".wv-ig-media-container": {
      overflow: "hidden",
      maxWidth: "100%",
      maxHeight: "100%",
      display: "grid",
      gridTemplateColumns: "repeat(var(--wv-ig-images-per-row, 4), 1fr)",
      gap: "var(--wv-ig-images-gap, 0px)",
      img: {
        // aspectRatio: '1 / 1',
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "cover"
      },
      video: {
        width: "100%",
        height: "100%"
      }
    }
  },
  "@mobile": {
    ".wv-ig-media-container": {
      overflowX: "auto",
      display: "flex",
      scrollSnapType: "x mandatory"
    },
    ".wv-ig-media-container a": {
      scrollSnapAlign: "start",
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: "100%"
    }
  }
};
Instagram.defaultProps = {
  token: "",
  username: "",
  numberOfImages: 8,
  imagesPerRow: 4,
  gap: 0
};
var instagram_default = Instagram;

// src/elements/layout.tsx
import { forwardRef as forwardRef14 } from "react";
import { jsx as jsx32, jsxs as jsxs17 } from "react/jsx-runtime";
var Layout = forwardRef14((props, ref) => {
  let {
    children,
    rows,
    gap,
    rowSize,
    columns,
    contentSize,
    gridSize,
    backgroundColor,
    backgroundImage,
    objectFit,
    objectPosition,
    enableOverlay,
    overlayOpacity,
    ...rest
  } = props;
  let style = {
    "--layout-content-width": "100vw",
    "--content-size": `${contentSize}px`,
    "--grid-size": `${gridSize}px`,
    "--rows": rows,
    "--columns": columns,
    "--gap": `${gap}px`,
    "--row-size": `${rowSize}px`,
    "--col-size": "calc((var(--grid-size) - calc(var(--columns) - 1) * var(--gap)) / var(--columns))"
  };
  return /* @__PURE__ */ jsxs17("div", { ref, ...rest, style, children: [
    /* @__PURE__ */ jsx32(
      Background,
      {
        backgroundColor,
        backgroundFit: objectFit,
        backgroundImage,
        backgroundPosition: objectPosition
      }
    ),
    /* @__PURE__ */ jsx32(Overlay2, { enableOverlay, overlayOpacity }),
    /* @__PURE__ */ jsx32("div", { "data-layout-content": true, children })
  ] });
});
var css17 = {
  "@desktop": {
    position: "relative",
    "> [data-layout-content]": {
      // paddingTop: 'var(--gap)',
      // paddingBottom: 'var(--gap)',
      margin: "0 auto",
      display: "grid",
      gridTemplateRows: "repeat(var(--rows), var(--row-size))",
      gridTemplateColumns: "calc((var(--layout-content-width) - var(--content-size)) / 2) 1fr repeat(var(--columns), minmax(0, var(--col-size))) 1fr calc((var(--layout-content-width) - var(--content-size)) / 2)",
      gridAutoRows: "var(--row-size)",
      gap: "var(--gap)",
      maxWidth: "var(--layout-content-width)"
    }
  },
  "@mobile": {
    padding: "0 16px",
    "> [data-layout-content]": {
      display: "flex",
      flexDirection: "column"
    }
  }
};
Layout.defaultProps = {
  contentSize: 1600,
  gridSize: 1224,
  rows: 16,
  columns: 12,
  gap: 16,
  rowSize: 48,
  objectFit: "cover",
  objectPosition: "center center",
  enableOverlay: false,
  overlayOpacity: 30
};
var layout_default = Layout;

// src/elements/map.tsx
import { forwardRef as forwardRef15 } from "react";
import { jsx as jsx33 } from "react/jsx-runtime";
var MapElement = forwardRef15((props, ref) => {
  let { place, zoom, ...rest } = props;
  return /* @__PURE__ */ jsx33("div", { ref, ...rest, children: /* @__PURE__ */ jsx33(
    "iframe",
    {
      height: "100%",
      loading: "lazy",
      src: `https://maps.google.com/maps?z=${zoom}&t=m&q=${place}&ie=UTF8&&output=embed`,
      style: { pointerEvents: "none" },
      title: "map",
      width: "100%"
    }
  ) });
});
var css18 = {
  "@desktop": {
    iframe: {
      border: "none"
    }
  },
  "@mobile": {
    iframe: {
      border: "none"
    }
  }
};
MapElement.defaultProps = {
  place: "Hanoi",
  zoom: 14
};
var map_default = MapElement;

// src/elements/product/product-buy-button/index.tsx
import { forwardRef as forwardRef16, useState as useState5 } from "react";

// src/hooks/use-product-context.ts
import { useContext as useContext7 } from "react";

// src/context.ts
import { createContext } from "react";
var ProductContext = createContext(null);
var ProductListContext = createContext({});
var ArticleContext = createContext({});
var BlogContext = createContext({});
var CollectionListContext = createContext({});
var CollectionContext = createContext(
  {}
);

// src/hooks/use-product-context.ts
function useProductContext() {
  let context = useContext7(ProductContext);
  if (!context) {
    throw new Error("`useProductContext` must be used within a ProductProvider");
  }
  return context;
}

// src/utils/cart.ts
function addProductToCart(productForm, onFinish) {
  let { cart_add_url = "/cart/add.js" } = window.weaverseShopifyConfigs?.shopData?.routes || {};
  fetch(cart_add_url, {
    method: "POST",
    body: new FormData(productForm)
  }).then((res) => res.json()).then((data) => {
    if (data.status === 422) {
      throw new Error(data.description);
    }
    window?.weaverseCartHelpers?.notify("on_item_added", data);
  }).catch(
    (err) => console.error(`Error adding product to cart: ${err.message}`)
  ).finally(onFinish);
}

// src/elements/product/product-buy-button/quantity-selector.tsx
import { useState as useState4 } from "react";
import { jsx as jsx34, jsxs as jsxs18 } from "react/jsx-runtime";
var { Icon: Icon5 } = Components;
function QuantitySelector() {
  let [quantity, setQuantity] = useState4(1);
  let onQuantityInputChange = (e) => {
    let value = Number(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  return /* @__PURE__ */ jsxs18("div", { className: "wv-quantity-selector", children: [
    /* @__PURE__ */ jsx34(
      "button",
      {
        "aria-label": "Decrease quantity",
        className: "wv-quantity-button dec-button",
        disabled: quantity <= 1,
        onClick: () => setQuantity(quantity - 1),
        type: "button",
        children: /* @__PURE__ */ jsx34(Icon5, { name: "Minus" })
      }
    ),
    /* @__PURE__ */ jsx34(
      "input",
      {
        "aria-label": "Product quantity input",
        className: "wv-quantity-input",
        name: "quantity",
        onChange: onQuantityInputChange,
        type: "number",
        value: quantity
      }
    ),
    /* @__PURE__ */ jsx34(
      "button",
      {
        "aria-label": "Increase quantity",
        className: "wv-quantity-button inc-button",
        onClick: () => setQuantity(quantity + 1),
        type: "button",
        children: /* @__PURE__ */ jsx34(Icon5, { name: "Plus" })
      }
    )
  ] });
}

// src/elements/product/product-buy-button/index.tsx
import { jsx as jsx35, jsxs as jsxs19 } from "react/jsx-runtime";
var ProductBuyButton = forwardRef16(
  (props, ref) => {
    let {
      showQuantitySelector,
      quantityLabel,
      buttonText,
      soldOutText,
      unavailableText,
      ...rest
    } = props;
    let [adding, setAdding] = useState5(false);
    let context = useProductContext();
    let { formRef, selectedVariant, ready } = context;
    let available = selectedVariant?.available;
    let handleATC = (e) => {
      e.preventDefault();
      setAdding(true);
      addProductToCart(
        formRef?.current,
        () => setAdding(false)
      );
    };
    let atcText = buttonText;
    if (ready) {
      if (!available) {
        atcText = soldOutText;
      }
      if (!selectedVariant) {
        atcText = unavailableText;
      }
    }
    return /* @__PURE__ */ jsxs19("div", { ref, ...rest, children: [
      showQuantitySelector && /* @__PURE__ */ jsx35("label", { className: "wv-product-quantity-label", children: quantityLabel }),
      /* @__PURE__ */ jsxs19("div", { className: "wv-product-buy-buttons", children: [
        showQuantitySelector && /* @__PURE__ */ jsx35(QuantitySelector, {}),
        /* @__PURE__ */ jsxs19(
          "button",
          {
            className: "wv-product-atc-button",
            disabled: adding || !available || !selectedVariant,
            onClick: handleATC,
            type: "submit",
            children: [
              /* @__PURE__ */ jsx35("span", { children: atcText }),
              adding && /* @__PURE__ */ jsx35(Components.Spinner, {})
            ]
          }
        )
      ] })
    ] });
  }
);
var css19 = {
  "@desktop": {
    marginTop: "20px",
    ".wv-product-quantity-label": {
      display: "inline-block",
      marginBottom: "5px",
      fontWeight: "500"
    },
    ".wv-product-buy-buttons": {
      display: "flex",
      ".wv-quantity-selector": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "10px",
        width: "130px",
        border: "1px solid #e2e8f0",
        borderRadius: "4px",
        ".wv-quantity-button": {
          display: "flex",
          padding: "0px",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          border: "none",
          backgroundColor: "transparent",
          cursor: "pointer",
          svg: {
            width: "16px",
            height: "16px"
          }
        },
        ".wv-quantity-input": {
          width: "50px",
          height: "40px",
          fontSize: "16px",
          border: "none",
          textAlign: "center",
          backgroundColor: "transparent",
          outline: "none"
        }
      },
      ".wv-product-atc-button": {
        backgroundColor: "#273820",
        padding: "0px",
        height: "50px",
        border: "none",
        color: "white",
        cursor: "pointer",
        flexGrow: 1,
        fontWeight: "500",
        fontSize: "1em",
        lineHeight: "1",
        textAlign: "center",
        transition: "background-color 0.2s ease-in-out",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          backgroundColor: "#2c3e2f"
        },
        "&:disabled": {
          opacity: "0.5",
          cursor: "not-allowed"
        }
      }
    }
  },
  "@mobile": {
    ".wv-product-buy-buttons": {
      ".wv-quantity-selector": {
        width: "110px",
        ".wv-quantity-input": {
          width: "30px"
        }
      }
    }
  }
};
ProductBuyButton.defaultProps = {
  showQuantitySelector: true,
  quantityLabel: "Quantity",
  buttonText: "Add to cart",
  soldOutText: "Sold Out",
  unavailableText: "Unavailable"
};
var product_buy_button_default = ProductBuyButton;

// src/elements/product/product-description/index.tsx
import { WeaverseContext as WeaverseContext7 } from "@weaverse/react";
import { forwardRef as forwardRef17, useContext as useContext8 } from "react";

// src/elements/product/product-description/view-details.tsx
import { jsx as jsx36, jsxs as jsxs20 } from "react/jsx-runtime";
var { Modal: Modal2, ModalTrigger: ModalTrigger2, ModalHeader: ModalHeader2, ModalContent: ModalContent2 } = Components.ModalComponents;
function ViewDetails(props) {
  let { viewDetailsText, children } = props;
  return /* @__PURE__ */ jsxs20(Modal2, { children: [
    /* @__PURE__ */ jsx36(ModalTrigger2, { asChild: true, children: /* @__PURE__ */ jsx36("button", { className: "wv-view-details-button", type: "button", children: viewDetailsText }) }),
    /* @__PURE__ */ jsxs20(ModalContent2, { children: [
      /* @__PURE__ */ jsx36(ModalHeader2, { children: "Product description" }),
      children
    ] })
  ] });
}

// src/elements/product/product-description/index.tsx
import { jsx as jsx37, jsxs as jsxs21 } from "react/jsx-runtime";
var ProductDescription = forwardRef17(
  (props, ref) => {
    let {
      lineClamp,
      showViewDetailsButton,
      viewDetailsText,
      viewDetailsClickAction,
      isInsideProductQuickView,
      children,
      ...rest
    } = props;
    let { product } = useProductContext();
    let style = {
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: lineClamp
    };
    let { isDesignMode } = useContext8(WeaverseContext7);
    let shopData = window.weaverseShopifyConfigs?.shopData || {};
    let isNotProductPage = shopData?.request?.page_type !== "product";
    let goToProductPage = () => {
      if (!isDesignMode) {
        window.location.href = product.url;
      }
    };
    let viewDetailsButton = null;
    if (showViewDetailsButton) {
      if (viewDetailsClickAction === "goToProductPage" && (isNotProductPage || isInsideProductQuickView)) {
        viewDetailsButton = /* @__PURE__ */ jsx37(
          "button",
          {
            className: "wv-view-details-button",
            onClick: goToProductPage,
            type: "button",
            children: viewDetailsText
          }
        );
      } else {
        viewDetailsButton = /* @__PURE__ */ jsx37(ViewDetails, { viewDetailsText, children: /* @__PURE__ */ jsx37(
          "div",
          {
            className: "wv-product-description-details",
            dangerouslySetInnerHTML: { __html: product.body_html }
          }
        ) });
      }
    }
    return /* @__PURE__ */ jsxs21("div", { ref, ...rest, children: [
      /* @__PURE__ */ jsx37(
        "div",
        {
          className: "wv-product-description",
          dangerouslySetInnerHTML: { __html: product.body_html },
          style
        }
      ),
      viewDetailsButton
    ] });
  }
);
var css20 = {
  "@desktop": {
    marginTop: "16px",
    marginBottom: "24px",
    ".wv-product-description": {
      overflow: "hidden",
      display: "-webkit-box",
      img: {
        display: "none"
      },
      div: {
        display: "block"
      },
      "& > *:first-child": {
        margin: 0
      }
    },
    ".wv-view-details-button": {
      outline: "none",
      boxShadow: "none",
      cursor: "pointer",
      border: "none",
      backgroundColor: "transparent",
      fontSize: "14px",
      padding: "0",
      color: "rgb(56, 142, 255)",
      marginTop: "16px",
      "&:hover": {
        textDecoration: "underline",
        color: "rgb(0, 42, 140)"
      }
    },
    ".wv-product-description-details": {
      maxHeight: "80vh",
      overflowY: "auto",
      margin: "0 -24px",
      padding: "0 24px",
      width: "calc(100% + 48px)",
      maxWidth: "unset"
    }
  }
};
ProductDescription.defaultProps = {
  lineClamp: 3,
  showViewDetailsButton: true,
  isInsideProductQuickView: false,
  viewDetailsText: "View details"
};
var product_description_default = ProductDescription;

// src/elements/product/product-details/index.tsx
import { forwardRef as forwardRef18 } from "react";

// src/elements/product/product-details/skeleton.tsx
import { jsx as jsx38, jsxs as jsxs22 } from "react/jsx-runtime";
var { Icon: Icon6 } = Components;
function ProductSkeleton() {
  return /* @__PURE__ */ jsxs22("div", { className: "wv-product-form wv-product-details-skeleton animate-pulse", children: [
    /* @__PURE__ */ jsxs22("div", { className: "wv-media", children: [
      /* @__PURE__ */ jsx38("div", { className: "wv-media-main-image", children: /* @__PURE__ */ jsx38(Icon6, { name: "Image" }) }),
      /* @__PURE__ */ jsx38("div", { className: "wv-media-thumbnails", children: new Array(6).fill(0).map((_, i) => /* @__PURE__ */ jsx38("div", { className: "wv-media-thumbnail-item", children: /* @__PURE__ */ jsx38(Icon6, { name: "Image" }) }, i)) })
    ] }),
    /* @__PURE__ */ jsxs22("div", { className: "wv-info", children: [
      /* @__PURE__ */ jsx38("div", { className: "wv-info-vendor" }),
      /* @__PURE__ */ jsxs22("div", { className: "wv-info-title", children: [
        /* @__PURE__ */ jsx38("div", { className: "wv-item" }),
        /* @__PURE__ */ jsx38("div", { className: "wv-item" }),
        /* @__PURE__ */ jsx38("div", { className: "wv-item" })
      ] }),
      /* @__PURE__ */ jsxs22("div", { className: "wv-info-price", children: [
        /* @__PURE__ */ jsx38("div", { className: "wv-price-item" }),
        /* @__PURE__ */ jsx38("div", { className: "wv-price-item" }),
        /* @__PURE__ */ jsx38("div", { className: "wv-price-item" })
      ] }),
      /* @__PURE__ */ jsxs22("div", { className: "wv-info-options", children: [
        /* @__PURE__ */ jsxs22("div", { className: "wv-option-circle", children: [
          /* @__PURE__ */ jsx38("div", { className: "wv-option-item" }),
          /* @__PURE__ */ jsx38("div", { className: "wv-option-item" }),
          /* @__PURE__ */ jsx38("div", { className: "wv-option-item" })
        ] }),
        /* @__PURE__ */ jsxs22("div", { className: "wv-option-round", children: [
          /* @__PURE__ */ jsx38("div", { className: "wv-option-item" }),
          /* @__PURE__ */ jsx38("div", { className: "wv-option-item" }),
          /* @__PURE__ */ jsx38("div", { className: "wv-option-item" })
        ] })
      ] }),
      /* @__PURE__ */ jsx38("div", { className: "wv-info-buy-button", children: /* @__PURE__ */ jsx38(Icon6, { name: "ShoppingCart" }) }),
      /* @__PURE__ */ jsxs22("div", { className: "wv-info-description", children: [
        /* @__PURE__ */ jsx38("div", { className: "wv-line-1" }),
        /* @__PURE__ */ jsx38("div", { className: "wv-line-2" }),
        /* @__PURE__ */ jsx38("div", { className: "wv-line-3" }),
        /* @__PURE__ */ jsx38("div", { className: "wv-line-4" }),
        /* @__PURE__ */ jsx38("div", { className: "wv-line-5" })
      ] }),
      /* @__PURE__ */ jsxs22("div", { className: "wv-info-meta", children: [
        /* @__PURE__ */ jsxs22("div", { className: "wv-item-1", children: [
          /* @__PURE__ */ jsx38("div", { className: "wv-label" }),
          /* @__PURE__ */ jsx38("div", { className: "wv-value" })
        ] }),
        /* @__PURE__ */ jsxs22("div", { className: "wv-item-2", children: [
          /* @__PURE__ */ jsx38("div", { className: "wv-label" }),
          /* @__PURE__ */ jsx38("div", { className: "wv-value" })
        ] }),
        /* @__PURE__ */ jsxs22("div", { className: "wv-item-3", children: [
          /* @__PURE__ */ jsx38("div", { className: "wv-label" }),
          /* @__PURE__ */ jsx38("div", { className: "wv-value" })
        ] })
      ] })
    ] })
  ] });
}
var css21 = {
  "@desktop": {
    ".wv-product-details-skeleton": {
      display: "flex",
      gap: "24px",
      div: {
        display: "block"
      },
      ".wv-media": {
        width: "50%",
        ".wv-media-main-image": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#D1D5DB",
          height: "600px",
          borderRadius: "4px",
          svg: { width: "96px", height: "96px", color: "#E5E7EB" }
        },
        ".wv-media-thumbnails": {
          display: "flex",
          marginTop: "12px",
          gap: "12px",
          overflow: "hidden",
          ".wv-media-thumbnail-item": {
            backgroundColor: "#D1D5DB",
            height: "120px",
            width: "90px",
            display: "flex",
            flexShrink: 0,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "4px",
            svg: { width: "36px", height: "36px", color: "#E5E7EB" }
          }
        }
      },
      ".wv-info": {
        width: "50%",
        ".wv-info-vendor": {
          height: "10px",
          width: "250px",
          marginBottom: "16px",
          backgroundColor: "#E5E7EB"
        },
        ".wv-info-title": {
          marginBottom: "16px",
          display: "flex",
          gap: "6px",
          ".wv-item": {
            height: "32px",
            width: "180px",
            backgroundColor: "#D1D5DB"
          }
        },
        ".wv-info-price": {
          display: "flex",
          gap: "6px",
          ".wv-price-item": {
            height: "16px",
            width: "100px",
            backgroundColor: "#E5E7EB"
          }
        },
        ".wv-info-options": {
          margin: "32px 0",
          ".wv-option-circle": {
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            ".wv-option-item": {
              height: "50px",
              width: "50px",
              borderRadius: "9999px",
              backgroundColor: "#E5E7EB"
            }
          },
          ".wv-option-round": {
            display: "flex",
            gap: "10px",
            ".wv-option-item": {
              height: "40px",
              width: "100px",
              borderRadius: "2px",
              backgroundColor: "#E5E7EB"
            }
          }
        },
        ".wv-info-buy-button": {
          height: "52px",
          width: "100%",
          margin: "32px 0",
          backgroundColor: "#D1D5DB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          svg: { width: "28px", height: "28px", color: "#FFF" }
        },
        ".wv-info-description": {
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          "& > div": { borderRadius: "999px" },
          ".wv-line-1": {
            height: "8px",
            width: "500px",
            maxWidth: "100%",
            backgroundColor: "#E5E7EB"
          },
          ".wv-line-2": {
            height: "8px",
            width: "550px",
            backgroundColor: "#E5E7EB"
          },
          ".wv-line-3": {
            height: "8px",
            width: "470px",
            backgroundColor: "#E5E7EB"
          },
          ".wv-line-4": {
            height: "8px",
            width: "530px",
            backgroundColor: "#E5E7EB"
          },
          ".wv-line-5": {
            height: "8px",
            width: "510px",
            backgroundColor: "#E5E7EB"
          }
        },
        ".wv-info-meta": {
          margin: "32px 0",
          display: "flex",
          flexDirection: "column",
          "& > div": {
            display: "flex",
            justifyContent: "flex-start",
            gap: "16px",
            margin: "0 0 12px",
            maxWidth: "100%"
          },
          ".wv-item-1": { width: "350px" },
          ".wv-item-2": { width: "300px" },
          ".wv-item-3": { width: "400px" },
          ".wv-label, .wv-value": {
            height: "16px",
            backgroundColor: "#D1D5DB",
            width: "50%",
            borderRadius: "2px"
          }
        }
      }
    }
  },
  "@mobile": {
    ".wv-product-details-skeleton": {
      display: "block",
      ".wv-media, .wv-info": {
        width: "100%"
      },
      ".wv-media": {
        ".wv-media-main-image": {
          height: "300px",
          marginBottom: "24px"
        },
        ".wv-media-thumbnails": {
          display: "none"
        }
      }
    }
  }
};

// src/elements/product/product-details/use-product.ts
import { WeaverseContext as WeaverseContext8 } from "@weaverse/react";
import { useContext as useContext9, useEffect as useEffect4, useRef, useState as useState6 } from "react";
function useProduct(productId, useDefaultProduct) {
  let { isDesignMode } = useContext9(WeaverseContext8);
  let [ready, setReady] = useState6(false);
  let formRef = useRef(null);
  let product = weaverseShopifyProducts[productId];
  if (useDefaultProduct && !isDesignMode) {
    let defaultProduct = weaverseShopifyProducts.default;
    if (defaultProduct?.id) {
      product = defaultProduct;
    }
  }
  let [selectedVariant, setSelectedVariant] = useState6(null);
  useEffect4(() => {
    if (product) {
      setSelectedVariant(
        product.selected_or_first_available_variant || product.variants[0]
      );
      window.weaverseCartHelpers?.notify("on_product_rendered", {
        product,
        formRef
      });
      setReady(true);
    }
  }, [product]);
  return {
    product,
    ready,
    formRef,
    selectedVariant,
    setSelectedVariant
  };
}

// src/elements/product/product-details/index.tsx
import { jsx as jsx39, jsxs as jsxs23 } from "react/jsx-runtime";
var ProductDetails = forwardRef18(
  (props, ref) => {
    let {
      children,
      product: productPickerData,
      productId,
      productHandle,
      useDefaultProduct,
      ...rest
    } = props;
    productId ??= productPickerData?.id || "default";
    productHandle ??= productPickerData?.handle || "";
    let { ssrMode, isDesignMode } = useWeaverseShopify();
    let { product, ready, formRef, selectedVariant, setSelectedVariant } = useProduct(productId, useDefaultProduct);
    let shouldRenderSkeleton = Boolean(
      isDesignMode && productId && !product || ssrMode && (productId || useDefaultProduct)
    );
    let shouldRenderProduct = Boolean(isDesignMode && productId || product);
    if (shouldRenderSkeleton) {
      return /* @__PURE__ */ jsx39("div", { ...rest, ref, children: /* @__PURE__ */ jsx39(ProductSkeleton, {}) });
    }
    if (shouldRenderProduct) {
      return /* @__PURE__ */ jsx39("div", { ...rest, ref, children: /* @__PURE__ */ jsx39(
        ProductContext.Provider,
        {
          value: {
            product,
            ready,
            formRef,
            selectedVariant,
            setSelectedVariant
          },
          children: /* @__PURE__ */ jsxs23(
            "form",
            {
              acceptCharset: "UTF-8",
              action: "/cart/add",
              className: "wv-product-form product-details-form",
              "data-product-handle": product.handle,
              "data-product-id": product.id,
              encType: "multipart/form-data",
              id: `wv-product-form-${product.id}`,
              method: "post",
              noValidate: true,
              ref: formRef,
              children: [
                /* @__PURE__ */ jsx39("input", { name: "form_type", type: "hidden", value: "product" }),
                /* @__PURE__ */ jsx39("input", { name: "utf8", type: "hidden", value: "\u2713" }),
                children
              ]
            }
          )
        }
      ) });
    }
    return /* @__PURE__ */ jsx39("div", { ...rest, ref, children: /* @__PURE__ */ jsx39(Components.Placeholder, { element: "Product", children: "Select a product and start editing." }) });
  }
);
ProductDetails.defaultProps = {
  useDefaultProduct: false
};
var css22 = {
  "@desktop": {
    overflow: "hidden",
    "&.image-zoomed": {
      zIndex: 999
    },
    ".wv-product-form": {
      display: "flex",
      maxHeight: "100%"
    },
    ...css21["@desktop"]
  },
  "@mobile": {
    ".wv-product-form": {
      display: "block"
    },
    ...css21["@mobile"]
  }
};
var product_details_default = ProductDetails;

// src/elements/product/product-info.tsx
import { forwardRef as forwardRef19 } from "react";
import { jsx as jsx40 } from "react/jsx-runtime";
var ProductInfo = forwardRef19((props, ref) => {
  let { children, ...rest } = props;
  return /* @__PURE__ */ jsx40("div", { ref, ...rest, children });
});
var css23 = {
  "@desktop": {
    flexGrow: 1,
    paddingLeft: "16px"
  },
  "@mobile": {
    paddingLeft: "0px"
  }
};
var product_info_default = ProductInfo;

// src/elements/product/product-media/index.tsx
import { forwardRef as forwardRef20, useEffect as useEffect7, useState as useState7 } from "react";

// src/elements/product/product-media/media-fullscreen-slider.tsx
import { useKeenSlider as useKeenSlider2 } from "keen-slider/react";
import { jsx as jsx41 } from "react/jsx-runtime";
var { Modal: Modal3, ModalContent: ModalContent3 } = Components.ModalComponents;
function MediaFullscreenSlider(props) {
  let { open, onOpenChange, images } = props;
  let [sliderRef] = useKeenSlider2({
    slides: { perView: "auto", spacing: 20 },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1, spacing: 0 }
      }
    }
  });
  return /* @__PURE__ */ jsx41(Modal3, { onOpenChange, open, children: /* @__PURE__ */ jsx41(ModalContent3, { className: "wv-product-media-fullscreen", size: "fullscreen", children: /* @__PURE__ */ jsx41(
    "div",
    {
      className: "keen-slider wv-produt-media__fullscreen-slider",
      ref: sliderRef,
      children: images.map((image) => /* @__PURE__ */ jsx41("div", { className: "keen-slider__slide", children: /* @__PURE__ */ jsx41("img", { alt: image.alt || "", loading: "lazy", src: image.src }) }, image.id))
    }
  ) }) });
}
var css24 = {
  "@desktop": {
    ".wv-product-media-fullscreen": {
      padding: "80px 120px",
      ".wv-modal-content": {
        height: "100%",
        ".wv-produt-media__fullscreen-slider": {
          height: "100%",
          ".keen-slider__slide": {
            minWidth: "min(var(--media-aspect-ratio) * (100vh - 12rem), 60vw)",
            maxWidth: "min(var(--media-aspect-ratio) * (100vh - 12rem), 60vw)",
            display: "flex",
            alignItems: "center",
            img: {
              aspectRatio: "var(--media-aspect-ratio, auto)",
              width: "100%",
              cursor: "pointer",
              objectFit: "cover"
            }
          }
        }
      }
    }
  },
  "@mobile": {
    ".wv-product-media-fullscreen": {
      padding: "80px 10px"
    }
  }
};

// src/elements/product/product-media/use-media-slider.ts
import { useKeenSlider as useKeenSlider3 } from "keen-slider/react";
import { useEffect as useEffect5 } from "react";

// src/elements/product/product-media/thumbnail-plugin.ts
function ThumbnailPlugin(mainRef) {
  return (slider) => {
    function removeActive() {
      for (let slide of slider.slides) {
        slide.classList.remove("active");
      }
    }
    function addActive(idx) {
      slider.slides[idx].classList.add("active");
    }
    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) {
            mainRef.current.moveToIdx(idx);
          }
        });
      });
    }
    slider.on("created", () => {
      if (!mainRef.current) {
        return;
      }
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(next);
      });
    });
  };
}

// src/elements/product/product-media/use-media-slider.ts
function useMediaSlider(input) {
  let {
    context,
    thumbnailSlidePerView,
    onSlideChanged,
    onSliderCreated,
    ResizePlugin: ResizePlugin3
  } = input;
  let initialIndex = 0;
  let featured_image = context?.selectedVariant?.featured_image;
  if (featured_image) {
    initialIndex = featured_image.position - 1;
  }
  let [sliderRef, instanceRef] = useKeenSlider3(
    {
      initial: initialIndex,
      slideChanged: onSlideChanged,
      created: onSliderCreated
    },
    [ResizePlugin3]
  );
  let [thumbnailRef, thumbnailInstanceRef] = useKeenSlider3(
    {
      initial: initialIndex,
      slides: { perView: thumbnailSlidePerView, spacing: 10 },
      breakpoints: {
        "(max-width: 1024px)": {
          slides: { perView: 5 }
        }
      }
    },
    [ThumbnailPlugin(instanceRef), ResizePlugin3]
  );
  useEffect5(() => {
    if (context) {
      let targetMediaIndex = -1;
      let featured_image2 = context?.selectedVariant?.featured_image;
      if (featured_image2) {
        targetMediaIndex = featured_image2.position - 1;
      }
      if (targetMediaIndex >= 0 && instanceRef.current) {
        instanceRef.current.moveToIdx(targetMediaIndex);
      }
    }
  }, [context]);
  return [sliderRef, thumbnailRef, instanceRef, thumbnailInstanceRef];
}

// src/elements/product/product-media/use-media-zoom-in-effect.ts
import { useEffect as useEffect6 } from "react";
function useMediaZoomInEffect(zoomed, context) {
  useEffect6(() => {
    let productDetails = context?.formRef?.current?.closest(
      '[data-wv-type="product-details"]'
    );
    if (productDetails) {
      if (zoomed) {
        productDetails.classList.add("image-zoomed");
      } else {
        productDetails.classList.remove("image-zoomed");
      }
    }
  }, [zoomed, context]);
}

// src/elements/product/product-media/index.tsx
import { jsx as jsx42, jsxs as jsxs24 } from "react/jsx-runtime";
var mediaSizesMap = {
  small: "40%",
  medium: "50%",
  large: "60%"
};
var { Arrows: Arrows2, Dots: Dots2, ResizePlugin: ResizePlugin2 } = SliderComponents;
var ProductMedia = forwardRef20(
  (props, ref) => {
    let {
      mediaSize,
      aspectRatio,
      fallbackImage,
      allowFullscreen,
      thumbnailSlidePerView,
      ...rest
    } = props;
    let context = useProductContext();
    let [currentSlide, setCurrentSlide] = useState7(0);
    let [created, setCreated] = useState7(false);
    let [cssLoaded, setCssLoaded] = useState7(false);
    let [ready, setReady] = useState7(false);
    let [zoomed, setZoomed] = useState7(false);
    useMediaZoomInEffect(zoomed, context);
    let [sliderRef, thumbnailRef, instanceRef, thumbnailInstanceRef] = useMediaSlider({
      context,
      thumbnailSlidePerView,
      onSlideChanged: (slider) => {
        setCurrentSlide(slider.track.details.rel);
      },
      onSliderCreated: () => {
        setCreated(true);
      },
      ResizePlugin: ResizePlugin2
    });
    useEffect7(() => {
      if (created && cssLoaded) {
        window.requestAnimationFrame(() => {
          let initialIndex = instanceRef?.current?.options?.initial || 0;
          instanceRef?.current?.update(void 0, initialIndex);
          thumbnailInstanceRef?.current?.update(void 0, initialIndex);
          setReady(true);
        });
      }
    }, [mediaSize, aspectRatio, created, cssLoaded]);
    let { images, aspect_ratio } = context.product;
    let style = {
      "--media-width": mediaSizesMap[mediaSize],
      "--media-aspect-ratio": aspectRatio === "auto" ? aspect_ratio || "auto" : aspectRatio,
      "--media-opacity": ready ? 1 : 0
    };
    if (images.length <= 1) {
      let image = images[0] || {
        src: fallbackImage || PRODUCT_IMAGE_PLACEHOLDER,
        alt: "Product media placeholder",
        width: 1e3,
        height: 1e3
      };
      return /* @__PURE__ */ jsx42("div", { ref, ...rest, style, children: /* @__PURE__ */ jsx42("div", { className: "wv-product-image__single", children: /* @__PURE__ */ jsx42(Image2, { image, onLoad: () => setReady(true), width: 1e3 }) }) });
    }
    return /* @__PURE__ */ jsxs24("div", { ref, ...rest, style, children: [
      /* @__PURE__ */ jsx42(
        "link",
        {
          href: "https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css",
          onLoad: () => setCssLoaded(true),
          rel: "stylesheet"
        }
      ),
      /* @__PURE__ */ jsxs24("div", { className: "wv-product-slider__wrapper", children: [
        /* @__PURE__ */ jsx42("div", { className: "keen-slider wv-product-slider", ref: sliderRef, children: images.map((image) => /* @__PURE__ */ jsx42(
          Image2,
          {
            className: "keen-slider__slide wv-product-slider__slide",
            image,
            onClick: () => allowFullscreen && setZoomed(true),
            width: 1e3
          },
          image.id
        )) }),
        created && instanceRef?.current && /* @__PURE__ */ jsx42(
          Arrows2,
          {
            className: "wv-pmedia-slider__arrows",
            currentSlide,
            icon: "arrow",
            instanceRef,
            offset: 10
          }
        ),
        created && instanceRef.current && /* @__PURE__ */ jsx42(
          Dots2,
          {
            className: "wv-pmedia-slider__dots",
            color: "dark",
            currentSlide,
            instanceRef
          }
        )
      ] }),
      /* @__PURE__ */ jsx42("div", { className: "keen-slider wv-thumbnail-slider", ref: thumbnailRef, children: images.map((image) => /* @__PURE__ */ jsx42(
        Image2,
        {
          className: "keen-slider__slide wv-thumbnail__slide",
          image,
          width: 480
        },
        image.id
      )) }),
      allowFullscreen && /* @__PURE__ */ jsx42(
        MediaFullscreenSlider,
        {
          images,
          onOpenChange: setZoomed,
          open: zoomed
        }
      )
    ] });
  }
);
ProductMedia.defaultProps = {
  mediaSize: "medium",
  aspectRatio: "auto",
  allowFullscreen: true,
  thumbnailSlidePerView: 6
};
var css25 = {
  "@desktop": {
    minWidth: "var(--media-width, 50%)",
    maxWidth: "var(--media-width, 50%)",
    paddingRight: "16px",
    transition: "opacity 0.3s ease-in-out",
    opacity: "var(--media-opacity, 0)",
    ".wv-product-image__single": {
      display: "flex",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      img: {
        aspectRatio: "var(--media-aspect-ratio, auto)",
        height: "100%",
        maxWidth: "100%",
        cursor: "pointer",
        objectFit: "cover"
      }
    },
    ".wv-product-slider__wrapper": {
      position: "relative",
      ".wv-product-slider": {
        aspectRatio: "var(--media-aspect-ratio, auto)",
        ".wv-product-slider__slide": {
          cursor: "pointer",
          height: "100%",
          objectFit: "cover"
        }
      },
      ".wv-pmedia-slider__dots": {
        display: "none"
      }
    },
    ".wv-thumbnail-slider": {
      marginTop: "10px",
      ".wv-thumbnail__slide": {
        aspectRatio: "var(--media-aspect-ratio, auto)",
        height: "100%",
        objectFit: "cover",
        cursor: "pointer",
        padding: "6px",
        border: "1px solid transparent",
        "&.active": {
          border: "1px solid #000"
        }
      }
    },
    ...css24["@desktop"]
  },
  "@mobile": {
    minWidth: "100%",
    maxWidth: "100%",
    paddingRight: "0px",
    marginBottom: "32px",
    ".wv-product-slider__wrapper": {
      ".wv-pmedia-slider__dots": {
        display: "flex"
      }
    },
    ".wv-thumbnail-slider": {
      display: "none !important"
    },
    ...css24["@mobile"]
  }
};
var product_media_default = ProductMedia;

// src/elements/product/product-meta.tsx
import { forwardRef as forwardRef21 } from "react";
import { jsx as jsx43, jsxs as jsxs25 } from "react/jsx-runtime";
var ProductMeta = forwardRef21((props, ref) => {
  let { showSKU, showTags, showVendor, showType, ...rest } = props;
  let { product, selectedVariant } = useProductContext();
  return /* @__PURE__ */ jsx43("div", { ref, ...rest, children: /* @__PURE__ */ jsxs25("ul", { className: "wv-product-meta", children: [
    showSKU ? /* @__PURE__ */ jsxs25("li", { children: [
      /* @__PURE__ */ jsx43("div", { className: "meta-label", children: "SKU:" }),
      /* @__PURE__ */ jsx43("div", { className: "meta-value", children: selectedVariant?.sku || "N/A" })
    ] }) : null,
    showTags && product.tags.length ? /* @__PURE__ */ jsxs25("li", { children: [
      /* @__PURE__ */ jsx43("div", { className: "meta-label", children: "Tags:" }),
      /* @__PURE__ */ jsx43("div", { className: "meta-value", children: product.tags })
    ] }) : null,
    showVendor && product.vendor ? /* @__PURE__ */ jsxs25("li", { children: [
      /* @__PURE__ */ jsx43("div", { className: "meta-label", children: "Vendor:" }),
      /* @__PURE__ */ jsx43("div", { className: "meta-value", children: product.vendor })
    ] }) : null,
    showType && product.product_type ? /* @__PURE__ */ jsxs25("li", { children: [
      /* @__PURE__ */ jsx43("div", { className: "meta-label", children: "Category:" }),
      /* @__PURE__ */ jsx43("div", { className: "meta-value", children: product.product_type })
    ] }) : null
  ] }) });
});
ProductMeta.defaultProps = {
  showSKU: true,
  showTags: true,
  showVendor: true,
  showType: true
};
var css26 = {
  "@desktop": {
    marginTop: "30px",
    ".wv-product-meta": {
      padding: 0,
      margin: 0,
      li: {
        listStyle: "none",
        lineHeight: "32px",
        display: "flex",
        alignItems: "center",
        ".meta-label": {
          minWidth: "150px",
          fontWeight: "500"
        }
      }
    }
  }
};
var product_meta_default = ProductMeta;

// src/elements/product/product-price.tsx
import { forwardRef as forwardRef22, useEffect as useEffect8, useState as useState8 } from "react";
import { jsx as jsx44, jsxs as jsxs26 } from "react/jsx-runtime";
var ProductPrice = forwardRef22(
  (props, ref) => {
    let { showCompareAt, showComparePriceFirst, showSaleBadge, ...rest } = props;
    let context = useProductContext();
    let [variant, setVariant] = useState8(context.selectedVariant);
    useEffect8(() => {
      if (context.selectedVariant) {
        setVariant(context.selectedVariant);
      }
    }, [context.selectedVariant]);
    let { product } = context;
    let { money_format } = weaverseShopifyConfigs.shopData;
    let price = product?.price || 0;
    let compare_at_price = product?.compare_at_price || 0;
    if (variant) {
      price = variant.price;
      compare_at_price = variant.compare_at_price || 0;
    }
    let savedPercentage = 0;
    if (compare_at_price && Number(compare_at_price) > Number(price)) {
      let savedAmount = Number(compare_at_price) - Number(price);
      savedPercentage = Math.round(
        savedAmount / Number(compare_at_price) * 100
      );
    }
    let comparePrice = showCompareAt && compare_at_price ? /* @__PURE__ */ jsx44(
      "s",
      {
        className: "wv-compare-price",
        dangerouslySetInnerHTML: {
          __html: formatMoney(compare_at_price, money_format)
        }
      }
    ) : null;
    return /* @__PURE__ */ jsxs26("div", { ref, ...rest, children: [
      showComparePriceFirst ? comparePrice : null,
      /* @__PURE__ */ jsx44(
        "span",
        {
          className: "wv-sale-price",
          dangerouslySetInnerHTML: { __html: formatMoney(price, money_format) }
        }
      ),
      showComparePriceFirst ? null : comparePrice,
      showSaleBadge && savedPercentage > 0 ? /* @__PURE__ */ jsxs26("span", { className: "wv-sale-badge", children: [
        "Save ",
        savedPercentage,
        "%"
      ] }) : null
    ] });
  }
);
ProductPrice.defaultProps = {
  showCompareAt: true,
  showComparePriceFirst: false,
  showSaleBadge: true
};
var css27 = {
  "@desktop": {
    display: "flex",
    alignItems: "center",
    ".wv-sale-price": {
      fontSize: "24px",
      lineHeight: "32px"
    },
    ".wv-compare-price": {
      color: "rgba(33, 33, 33, .75)",
      marginLeft: "12px",
      fontSize: "24px",
      lineHeight: "32px"
    },
    ".wv-sale-badge": {
      color: "#ffffff",
      backgroundColor: "#da3f3f",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "12px",
      height: "22px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      lineHeight: "16px",
      padding: "2px 10px",
      textTransform: "uppercase"
    }
  }
};
var product_price_default = ProductPrice;

// src/elements/product/product-title.tsx
import { WeaverseContext as WeaverseContext9 } from "@weaverse/react";
import React5, { forwardRef as forwardRef23, useContext as useContext10 } from "react";
var ProductTitle = forwardRef23((props, ref) => {
  let { htmlTag, clickAction, ...rest } = props;
  let { isDesignMode } = useContext10(WeaverseContext9);
  let { product } = useProductContext();
  let shopData = window.weaverseShopifyConfigs?.shopData || {};
  let isNotProductPage = shopData?.request?.page_type !== "product";
  let handleClick = () => {
    if (!isDesignMode && clickAction === "goToProductPage" && isNotProductPage) {
      let { root_url = "/" } = window.weaverseShopifyConfigs?.shopData?.routes || {};
      let url = `${root_url}products/${product.handle}`;
      window.location.href = url;
    }
  };
  return React5.createElement(
    htmlTag,
    {
      ref,
      onClick: handleClick,
      "data-go-to-product": clickAction === "goToProductPage" && isNotProductPage,
      ...rest
    },
    product.title
  );
});
var css28 = {
  "@desktop": {
    fontSize: "34px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "46px",
    letterSpacing: "0px",
    wordBreak: "break-word",
    marginTop: "6px",
    marginBottom: "24px",
    marginLeft: "0px",
    marginRight: "0px",
    '&[data-go-to-product="true"]': {
      cursor: "pointer"
    }
  }
};
ProductTitle.defaultProps = {
  htmlTag: "h2"
};
var product_title_default = ProductTitle;

// src/elements/product/product-variant/index.tsx
import { forwardRef as forwardRef24 } from "react";

// src/utils/image.ts
function resizeImage(imageURL, size) {
  try {
    if (size === "original") {
      return imageURL;
    }
    let matches = imageURL.match(/(.*\/[\w\-_.]+)\.(\w{2,4})/);
    return `${matches[1]}_${size}.${matches[2]}`;
  } catch (_e) {
    return imageURL;
  }
}

// src/utils/swatch.ts
var optionSizeMap = {
  button: { sm: "32px", md: "40px", lg: "48px" },
  color: { sm: "32px", md: "40px", lg: "48px" },
  "custom-image": { sm: "32px", md: "40px", lg: "48px" },
  "variant-image": { sm: "55px", md: "75px", lg: "85px" }
};
var optionRadiusSizeMap = {
  round: "4px",
  circle: "100%",
  square: "0px"
};
function getSwatchValue(type, value) {
  let { presets } = window.weaverseShopifyConfigs || {};
  let { colorSwatches = [], imageSwatches = [] } = presets;
  if (type === "color") {
    let colorSwatch = colorSwatches.find(
      ({ name }) => name.toLowerCase() === value.toLowerCase()
    );
    return colorSwatch?.value;
  }
  let imageSwatch = imageSwatches.find(
    ({ name }) => name.toLowerCase() === value.toLowerCase()
  );
  return imageSwatch?.value;
}

// src/utils/variant.ts
function getVariantFromOptionArray(product, options) {
  validateProductStructure(product);
  validateOptionsArray(options);
  let result = product.variants.filter(
    (variant) => options.every((option, index) => {
      let variantOptions = getVariantOptions(variant);
      return variantOptions[index] === option;
    })
  );
  return result[0] || null;
}
function getVariantOptions(variant) {
  if (variant.options) {
    return Array.from(variant.options);
  }
  return [variant.option1, variant.option2, variant.option3].filter(
    Boolean
  );
}
function validateProductStructure(product) {
  if (typeof product !== "object") {
    throw new TypeError(`${product} is not an object.`);
  }
  if (Object.keys(product).length === 0 && product.constructor === Object) {
    throw new Error(`${product} is empty.`);
  }
}
function validateOptionsArray(options) {
  if (Array.isArray(options) && typeof options[0] === "object") {
    throw new Error(`${options}is not a valid array of options.`);
  }
}

// src/utils/option.ts
function getOptionsGroupConfigs(option) {
  let { swatches } = window.weaverseShopifyConfigs || {};
  let optionConfig = swatches?.find((sw) => sw.name === option.name);
  let optionDisplayName = option.name;
  let optionDesign = DEFAULT_OPTION_DESIGN;
  let style = {};
  if (optionConfig) {
    let { displayName, type, size, shape } = optionConfig;
    optionDisplayName = displayName;
    optionDesign = type;
    if (type !== "dropdown") {
      style = {
        "--size": optionSizeMap[type]?.[size],
        "--radius": optionRadiusSizeMap[shape]
      };
    }
  }
  return {
    optionDisplayName,
    optionDesign,
    style
  };
}
function getOptionItemStyle(value, type, position, product) {
  if (/button|dropdown/.test(type)) {
    return {};
  }
  let colorSwatch = getSwatchValue("color", value);
  let imageSwatch = getSwatchValue("image", value);
  let bgImage = "";
  if (type === "custom-image") {
    bgImage = `url(${imageSwatch})`;
  }
  if (type === "variant-image") {
    let variantImage = "";
    let variant = product.variants.find(
      (v) => v.options[position - 1] === value
    );
    if (variant?.featured_image) {
      variantImage = resizeImage(variant?.featured_image.src, "200x");
    }
    if (variantImage || imageSwatch) {
      bgImage = `url(${variantImage || imageSwatch})`;
    }
  }
  return {
    "--background-color": colorSwatch || value.toLocaleLowerCase(),
    "--background-image": bgImage,
    "--aspect-ratio": product.aspect_ratio || 1
  };
}
function getSoldOutAndUnavailableState(value, position, product, selectedOptions) {
  let state = { soldOut: false, unavailable: false };
  if (selectedOptions.length) {
    let maxOptions = product.options.length;
    let matchVariants = [];
    if (position === maxOptions) {
      let options = Array.from(selectedOptions);
      options[maxOptions - 1] = value;
      matchVariants.push(getVariantFromOptionArray(product, options));
    } else {
      matchVariants = product.variants.filter(
        (v) => v.options[position - 1] === value && v.options[position - 2] === selectedOptions[position - 2]
      );
    }
    matchVariants = matchVariants.filter(Boolean);
    if (matchVariants.length) {
      state.soldOut = matchVariants.every((v) => v.available === false);
    } else {
      state.unavailable = true;
    }
  }
  return state;
}

// src/elements/product/product-variant/combined-variant-selector.tsx
import { Fragment as Fragment6, jsx as jsx45, jsxs as jsxs27 } from "react/jsx-runtime";
function CombinedVariantSelector({ context }) {
  let { product, selectedVariant, setSelectedVariant } = context;
  if (!product.variants) {
    return null;
  }
  return /* @__PURE__ */ jsxs27(Fragment6, { children: [
    /* @__PURE__ */ jsx45("label", { className: "wv-combined-variant__label", htmlFor: "id", children: "Select variant" }),
    /* @__PURE__ */ jsx45(
      "select",
      {
        className: "wv-combined-variant__selector",
        name: "id",
        onChange: (e) => {
          let variantId = Number(e.target.value);
          let variant = product.variants.find(({ id }) => id === variantId);
          if (variant) {
            setSelectedVariant(variant);
          }
        },
        value: selectedVariant?.id,
        children: product.variants.map((variant) => /* @__PURE__ */ jsx45("option", { value: variant.id, children: variant.title }, variant.id))
      }
    )
  ] });
}

// src/elements/product/product-variant/option-values.tsx
import { jsx as jsx46, jsxs as jsxs28 } from "react/jsx-runtime";
var { Tooltip: Tooltip2 } = Components;
function OptionValues(props) {
  let {
    product,
    option,
    type,
    selectedValue,
    selectedOptions,
    onSelect,
    showTooltip,
    hideUnavailableOptions
  } = props;
  let { values, position } = option;
  if (type === "dropdown") {
    return /* @__PURE__ */ jsx46(
      "select",
      {
        className: "wv-option__dropdown",
        onChange: (e) => onSelect(position, e.target.value),
        value: selectedValue || values[0],
        children: values.map((value, idx) => {
          let state = getSoldOutAndUnavailableState(
            value,
            position,
            product,
            selectedOptions
          );
          if (hideUnavailableOptions && state.unavailable) {
            return null;
          }
          let className = clsx_default(
            state.soldOut && "sold-out",
            state.unavailable && "unavailable"
          );
          return /* @__PURE__ */ jsx46("option", { className, value, children: value }, value + idx);
        })
      }
    );
  }
  return /* @__PURE__ */ jsx46("div", { className: "wv-option__values", children: values.map((value, idx) => {
    let style = getOptionItemStyle(value, type, position, product);
    let state = getSoldOutAndUnavailableState(
      value,
      position,
      product,
      selectedOptions
    );
    let shouldShowTooltip = showTooltip && ["color", "custom-image", "variant-image"].includes(type);
    let className = clsx_default(
      "wv-option__value",
      `wv-option__${type}`,
      selectedValue === value && "selected",
      state.soldOut && "sold-out",
      state.unavailable && [
        "unavailable",
        hideUnavailableOptions && "hidden"
      ]
    );
    let wrapperClassName = clsx_default(
      "wv-option__value-container",
      shouldShowTooltip && "wv-tooltip-container"
    );
    return /* @__PURE__ */ jsxs28("div", { className: wrapperClassName, children: [
      /* @__PURE__ */ jsx46(
        "div",
        {
          className,
          onClick: () => onSelect(position, value),
          style,
          children: /* @__PURE__ */ jsx46("span", { children: value })
        }
      ),
      shouldShowTooltip && /* @__PURE__ */ jsx46(Tooltip2, { children: value })
    ] }, value + idx);
  }) });
}
var css29 = {
  "@desktop": {
    ".wv-option__values": {
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: "10px",
      ".wv-option__value-container": {
        display: "inline-flex",
        ".wv-option__value": {
          display: "inline-block",
          cursor: "pointer",
          textTransform: "capitalize",
          transition: ".3s all",
          minWidth: "var(--size, 40px)",
          borderRadius: "var(--radius, 0px)",
          "& > span": {
            width: "100%",
            height: "100%",
            display: "inline-block",
            borderRadius: "var(--radius, 0px)"
          },
          "&.sold-out, &.unavailable": {
            opacity: "0.6",
            overflow: "hidden",
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              zIndex: "1",
              inset: "0px",
              opacity: "1",
              border: "none",
              visibility: "visible",
              background: "no-repeat center/100% 100% rgba(0,0,0,0)",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(112, 113, 115, 0.5)' stroke-width='0.4' preserveAspectRatio='none' %3E%3Cline x1='24' y1='0' x2='0' y2='24'%3E%3C/line%3E%3C/svg%3E")`
            }
          },
          "&.unavailable.hidden": {
            display: "none"
          },
          "&.wv-option__button": {
            padding: "0 10px",
            lineHeight: "var(--size, 40px)",
            textAlign: "center"
          },
          "&.wv-option__color > span": {
            backgroundColor: "var(--background-color)"
          },
          "&.wv-option__variant-image": {
            aspectRatio: "var(--aspect-ratio, 1/1)"
          },
          "&.wv-option__button, &.wv-option__color, &.wv-option__custom-image": {
            height: "var(--size, 40px)"
          },
          "&.wv-option__button, &.wv-option__color, &.wv-option__variant-image, &.wv-option__custom-image": {
            border: "1px solid var(--wv-option-border-color)",
            "&:hover, &.selected": {
              borderColor: "var(--wv-selected-option-border-color)"
            }
          },
          "&.wv-option__variant-image, &.wv-option__custom-image > span": {
            fontSize: "0",
            backgroundColor: "var(--background-color)",
            backgroundImage: "var(--background-image)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          },
          "&.wv-option__color, &.wv-option__custom-image": {
            fontSize: "0",
            padding: "3px"
          }
        }
      }
    }
  }
};

// src/elements/product/product-variant/use-options.ts
import React6, { useEffect as useEffect9 } from "react";
function useOptions(context) {
  let [selectedOptions, setSelectedOptions] = React6.useState(() => {
    if (context.selectedVariant) {
      return getVariantOptions(context.selectedVariant);
    }
    return [];
  });
  useEffect9(() => {
    if (context.selectedVariant) {
      setSelectedOptions(getVariantOptions(context.selectedVariant));
    }
  }, [context.selectedVariant]);
  return [selectedOptions, setSelectedOptions];
}

// src/elements/product/product-variant/index.tsx
import { jsx as jsx47, jsxs as jsxs29 } from "react/jsx-runtime";
var ProductVariant = forwardRef24(
  (props, ref) => {
    let { optionsStyle, showTooltip, hideUnavailableOptions, ...rest } = props;
    let context = useProductContext();
    let [selectedOptions, setSelectedOptions] = useOptions(context);
    let { product, selectedVariant, setSelectedVariant } = context;
    let handleSelectOption = (position, value) => {
      selectedOptions[position - 1] = value;
      let newVariant = getVariantFromOptionArray(product, selectedOptions);
      if (!newVariant && hideUnavailableOptions) {
        let newOptions = selectedOptions.filter((_, idx) => idx < position);
        newVariant = getVariantFromOptionArray(product, newOptions);
        selectedOptions = newVariant.options;
      }
      setSelectedVariant(newVariant);
      setSelectedOptions([...selectedOptions]);
    };
    if (!product.has_only_default_variant) {
      let style = {
        "--wv-option-border-color": "#cbcbcb",
        "--wv-selected-option-border-color": "#232323"
      };
      if (optionsStyle === "combined") {
        return /* @__PURE__ */ jsx47("div", { ref, ...rest, style, children: /* @__PURE__ */ jsx47(CombinedVariantSelector, { context }) });
      }
      return /* @__PURE__ */ jsxs29("div", { ref, ...rest, style, children: [
        /* @__PURE__ */ jsx47("input", { name: "id", type: "hidden", value: selectedVariant?.id }),
        product.options.map((option) => {
          let { name, position } = option;
          let selectedValue = selectedOptions[position - 1];
          let { optionDisplayName, optionDesign, style: style2 } = getOptionsGroupConfigs(option);
          return /* @__PURE__ */ jsxs29(
            "div",
            {
              className: "wv-product-option",
              style: style2,
              children: [
                /* @__PURE__ */ jsxs29("div", { className: "wv-option__label", children: [
                  /* @__PURE__ */ jsxs29("span", { className: "wv-option__display-name", children: [
                    optionDisplayName,
                    ":"
                  ] }),
                  /* @__PURE__ */ jsx47("span", { className: "wv-option__selected-value", children: selectedValue })
                ] }),
                /* @__PURE__ */ jsx47(
                  OptionValues,
                  {
                    hideUnavailableOptions,
                    onSelect: handleSelectOption,
                    option,
                    product,
                    selectedOptions,
                    selectedValue,
                    showTooltip,
                    type: optionDesign
                  }
                )
              ]
            },
            name + position
          );
        })
      ] });
    }
    return /* @__PURE__ */ jsx47("div", { "data-has-only-default-variant": true, ref, ...rest, children: /* @__PURE__ */ jsx47("input", { name: "id", type: "hidden", value: selectedVariant?.id }) });
  }
);
ProductVariant.defaultProps = {
  optionsStyle: "combined"
};
var css30 = {
  "@desktop": {
    display: "flex",
    flexDirection: "column",
    margin: "24px 0",
    ".wv-combined-variant__label": {
      marginBottom: "5px"
    },
    ".wv-combined-variant__selector, .wv-option__dropdown": {
      border: "1px solid var(--wv-selected-option-border-color)",
      borderRadius: "4px",
      lineHeight: "48px",
      fontSize: "16px",
      height: "48px",
      width: "fit-content",
      minWidth: "120px"
    },
    ".wv-product-option": {
      "&:not(:last-child)": {
        marginBottom: "20px"
      },
      ".wv-option__label": {
        marginBottom: "6px",
        ".wv-option__display-name": {
          marginRight: "6px",
          fontWeight: "bold"
        }
      },
      ...css29["@desktop"]
    },
    "&[data-has-only-default-variant]": {
      display: "none"
    }
  }
};
var product_variant_default = ProductVariant;

// src/elements/product/product-vendor.tsx
import { forwardRef as forwardRef25 } from "react";
import { jsx as jsx48, jsxs as jsxs30 } from "react/jsx-runtime";
var ProductVendor = forwardRef25(
  (props, ref) => {
    let { showLabel, labelText, clickAction, openInNewTab, ...rest } = props;
    let { product } = useProductContext();
    return /* @__PURE__ */ jsxs30("div", { ref, ...rest, children: [
      showLabel && /* @__PURE__ */ jsx48("span", { className: "wv-product-vendor__label", children: labelText }),
      clickAction === "none" ? /* @__PURE__ */ jsx48("span", { className: "wv-produt-vendor__text", children: product.vendor }) : /* @__PURE__ */ jsx48(
        "a",
        {
          className: "wv-produt-vendor__text",
          href: `/collections/vendors?q=${product.vendor}`,
          rel: "noreferrer",
          target: openInNewTab ? "_blank" : "_self",
          children: product.vendor
        }
      )
    ] });
  }
);
ProductVendor.defaultProps = {
  showLabel: true,
  labelText: "By",
  clickAction: "openLink",
  openInNewTab: true
};
var css31 = {
  "@desktop": {
    color: "#666666",
    fontSize: "14px",
    lineHeight: "20px",
    fontStyle: "normal",
    fontWeight: 400,
    ".wv-product-vendor__label": {
      fontSize: "15px",
      lineHeight: "1.4em",
      fontWeight: "bold",
      marginRight: "4px"
    },
    ".wv-produt-vendor__text": {
      color: "#666666",
      textDecoration: "underline",
      textUnderlineOffset: "2px",
      textTransform: "capitalize"
    }
  }
};
var product_vendor_default = ProductVendor;

// src/elements/product/index.ts
var productElements = {
  ProductDetails: {
    type: "product-details",
    Component: product_details_default,
    defaultCss: css22
  },
  ProductInfo: {
    type: "product-info",
    Component: product_info_default,
    defaultCss: css23
  },
  ProductMedia: {
    type: "product-media",
    Component: product_media_default,
    defaultCss: css25
  },
  ProductTitle: {
    type: "product-title",
    Component: product_title_default,
    defaultCss: css28
  },
  ProductDescription: {
    type: "product-description",
    Component: product_description_default,
    defaultCss: css20
  },
  ProductVendor: {
    type: "product-vendor",
    Component: product_vendor_default,
    defaultCss: css31
  },
  ProductMeta: {
    type: "product-meta",
    Component: product_meta_default,
    defaultCss: css26
  },
  ProductPrice: {
    type: "product-price",
    Component: product_price_default,
    defaultCss: css27
  },
  ProductBuyButton: {
    type: "product-buy-button",
    Component: product_buy_button_default,
    defaultCss: css19
  },
  ProductVariant: {
    type: "product-variant",
    Component: product_variant_default,
    defaultCss: css30
  }
};

// src/elements/product-list/index.tsx
import { forwardRef as forwardRef26 } from "react";

// src/elements/product-list/product-quick-view.tsx
import { WeaverseContext as WeaverseContext10 } from "@weaverse/react";
import { useContext as useContext11 } from "react";
import { jsx as jsx49, jsxs as jsxs31 } from "react/jsx-runtime";
var { Icon: Icon7, ModalComponents } = Components;
var { Modal: Modal4, ModalContent: ModalContent4, ModalTrigger: ModalTrigger3 } = ModalComponents;
function ProductQuickView({ product }) {
  let { stitchesInstance } = useContext11(WeaverseContext10);
  let { className } = stitchesInstance.css(css32)();
  let quickViewModalClass = clsx_default("wv-pcard__quickview", className);
  return /* @__PURE__ */ jsxs31(Modal4, { children: [
    /* @__PURE__ */ jsx49(ModalTrigger3, { className: "wv-pcard__button quick-view", children: /* @__PURE__ */ jsx49(Icon7, { name: "Eye" }) }),
    /* @__PURE__ */ jsx49(ModalContent4, { className: quickViewModalClass, portal: true, size: "auto", children: /* @__PURE__ */ jsxs31(
      product_details_default,
      {
        className: "wv-pcard__details",
        productHandle: product.handle,
        productId: product.id,
        useDefaultProduct: false,
        children: [
          /* @__PURE__ */ jsx49(
            product_media_default,
            {
              allowFullscreen: false,
              aspectRatio: "auto",
              className: "wv-pcard__media",
              fallbackImage: PRODUCT_IMAGE_PLACEHOLDER,
              mediaSize: "medium",
              thumbnailSlidePerView: 5
            }
          ),
          /* @__PURE__ */ jsxs31(product_info_default, { className: "wv-pcard__info", children: [
            /* @__PURE__ */ jsx49(
              product_vendor_default,
              {
                className: "wv-pcard__vendor",
                clickAction: "none",
                labelText: "",
                openInNewTab: false,
                showLabel: false
              }
            ),
            /* @__PURE__ */ jsx49(
              product_title_default,
              {
                className: "wv-pcard__title",
                clickAction: "goToProductPage",
                htmlTag: "h4"
              }
            ),
            /* @__PURE__ */ jsx49(
              product_price_default,
              {
                className: "wv-pcard__price",
                showCompareAt: true,
                showComparePriceFirst: false,
                showSaleBadge: true
              }
            ),
            /* @__PURE__ */ jsx49(
              product_variant_default,
              {
                className: "wv-pcard__variant",
                hideUnavailableOptions: false,
                optionsStyle: "custom",
                showTooltip: true
              }
            ),
            /* @__PURE__ */ jsx49(
              product_buy_button_default,
              {
                buttonText: "Add to cart",
                className: "wv-pcard__buy-button",
                quantityLabel: "",
                showQuantitySelector: false,
                soldOutText: "Sold out",
                unavailableText: "Unavailable"
              }
            ),
            /* @__PURE__ */ jsx49(
              product_description_default,
              {
                className: "wv-pcard__description",
                isInsideProductQuickView: true,
                lineClamp: 3,
                showViewDetailsButton: true,
                viewDetailsClickAction: "goToProductPage",
                viewDetailsText: "View full details"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
var css32 = {
  "@desktop": {
    ".wv-pcard__details": { ...css22["@desktop"] },
    ".wv-pcard__media": { ...css25["@desktop"] },
    ".wv-pcard__info": { ...css23["@desktop"] },
    ".wv-pcard__vendor": { ...css31["@desktop"] },
    ".wv-pcard__title": { ...css28["@desktop"] },
    ".wv-pcard__price": { ...css27["@desktop"] },
    ".wv-pcard__variant": { ...css30["@desktop"] },
    ".wv-pcard__buy-button": { ...css19["@desktop"] },
    ".wv-pcard__description": { ...css20["@desktop"] }
  },
  "@mobile": {
    ".wv-pcard__details": { ...css22["@mobile"] },
    ".wv-pcard__media": { ...css25["@mobile"] },
    ".wv-pcard__info": { ...css23["@mobile"] },
    ".wv-pcard__vendor": { ...css31["@mobile"] },
    ".wv-pcard__title": { ...css28["@mobile"] },
    ".wv-pcard__price": { ...css27["@mobile"] },
    ".wv-pcard__variant": { ...css30["@mobile"] },
    ".wv-pcard__buy-button": { ...css19["@mobile"] },
    ".wv-pcard__description": { ...css20["@mobile"] }
  }
};

// src/elements/product-list/product-card-buttons.tsx
import { Fragment as Fragment7, jsx as jsx50, jsxs as jsxs32 } from "react/jsx-runtime";
function ProductCardButtons(props) {
  let {
    showViewDetailsButton,
    viewDetailsButtonText,
    showQuickViewButton,
    product
  } = props;
  if (showViewDetailsButton || showQuickViewButton) {
    return /* @__PURE__ */ jsxs32("div", { className: "wv-pcard__buttons", children: [
      showViewDetailsButton && /* @__PURE__ */ jsx50(
        "a",
        {
          className: "wv-pcard__button view-details",
          href: product.url,
          target: "_self",
          children: viewDetailsButtonText
        }
      ),
      showQuickViewButton && /* @__PURE__ */ jsxs32(Fragment7, { children: [
        /* @__PURE__ */ jsx50(
          "link",
          {
            href: "https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css",
            rel: "stylesheet"
          }
        ),
        /* @__PURE__ */ jsx50(ProductQuickView, { product })
      ] })
    ] });
  }
  return null;
}
var css33 = {
  "@desktop": {
    ".wv-pcard__buttons": {
      position: "absolute",
      bottom: "16px",
      left: "50%",
      transform: "translate3d(-50%, 80px, 0)",
      opacity: 0,
      transition: ".3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: "0 16px",
      ".wv-pcard__button": {
        border: "none",
        borderRadius: "4px",
        fontSize: "16px",
        fontWeight: "500",
        outline: "none",
        backgroundColor: "rgb(255, 255, 255)",
        color: "rgb(0, 0, 0)",
        minWidth: "44px",
        padding: "12px 4px",
        transition: "all .3s ease",
        svg: {
          width: 20,
          height: 20
        },
        "&.view-details": {
          width: "180px",
          marginRight: "8px",
          textDecoration: "none",
          textAlign: "center",
          display: "block",
          lineHeight: "20px",
          flexGrow: 1
        },
        "&.quick-view": {
          position: "relative",
          height: "44px"
        },
        "&:hover": {
          backgroundColor: "#121212",
          color: "rgb(255, 255, 255)"
        }
      }
    }
  }
};

// src/elements/product-list/product-card-options.tsx
import { jsx as jsx51, jsxs as jsxs33 } from "react/jsx-runtime";
var { Tooltip: Tooltip3 } = Components;
function ProductCardOptions(props) {
  let { product, optionName, optionLimit } = props;
  let { options, url, variants } = product;
  let foundOption = options.find((option) => option.name === optionName);
  if (foundOption) {
    let { values, position } = foundOption;
    let { optionDesign, style } = getOptionsGroupConfigs(foundOption);
    let valuesToDisplay = values.slice(0, optionLimit);
    let valuesLeft = values.length - valuesToDisplay.length;
    return /* @__PURE__ */ jsxs33("div", { className: "wv-pcard__options", style, children: [
      valuesToDisplay.map((value, idx) => {
        let style2 = getOptionItemStyle(value, optionDesign, position, product);
        let shouldShowTooltip = [
          "color",
          "custom-image",
          "variant-image"
        ].includes(optionDesign);
        let className = clsx_default(
          "wv-option__value",
          `wv-option__${optionDesign}`,
          shouldShowTooltip && "wv-tooltip-container"
        );
        let foundVariant = variants.find(
          (v) => v.options[position - 1] === value
        );
        let productURL = url;
        if (foundVariant) {
          productURL = `${url}?variant=${foundVariant.id}`;
        }
        return /* @__PURE__ */ jsxs33(
          "a",
          {
            className,
            href: productURL,
            style: style2,
            target: "_self",
            children: [
              /* @__PURE__ */ jsx51("span", { children: value }),
              shouldShowTooltip && /* @__PURE__ */ jsx51(Tooltip3, { children: value })
            ]
          },
          value + idx
        );
      }),
      valuesLeft > 0 && /* @__PURE__ */ jsxs33(
        "a",
        {
          className: "wv-option__value wv-option__left wv-tooltip-container",
          href: url,
          target: "_self",
          children: [
            /* @__PURE__ */ jsxs33("span", { children: [
              "+",
              valuesLeft
            ] }),
            /* @__PURE__ */ jsx51(Tooltip3, { children: "More options" })
          ]
        }
      )
    ] });
  }
  return null;
}
var css34 = {
  "@desktop": {
    ".wv-pcard__options": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: "12px",
      ".wv-option__value": {
        display: "inline-block",
        cursor: "pointer",
        textTransform: "capitalize",
        transition: ".3s all",
        minWidth: "var(--size, 40px)",
        borderRadius: "var(--radius, 0px)",
        marginBottom: "6px",
        marginRight: "6px",
        color: "#222",
        "& > span": {
          width: "100%",
          height: "100%",
          display: "inline-block",
          borderRadius: "var(--radius, 0px)",
          lineHeight: 1
        },
        "&.wv-option__button": {
          padding: "0 10px",
          lineHeight: "var(--size, 40px)",
          textAlign: "center"
        },
        "&.wv-option__color > span": {
          backgroundColor: "var(--background-color)"
        },
        "&.wv-option__variant-image": {
          aspectRatio: "var(--aspect-ratio, 1/1)"
        },
        "&.wv-option__button, &.wv-option__color, &.wv-option__custom-image": {
          height: "var(--size, 40px)"
        },
        "&.wv-option__button, &.wv-option__color, &.wv-option__variant-image, &.wv-option__custom-image": {
          border: "1px solid #dfdfdf",
          "&:hover": {
            borderColor: "#222"
          }
        },
        "&.wv-option__variant-image, &.wv-option__custom-image > span": {
          fontSize: "0",
          backgroundColor: "var(--background-color)",
          backgroundImage: "var(--background-image)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        },
        "&.wv-option__color, &.wv-option__custom-image": {
          fontSize: "0",
          "&:hover": {
            padding: "2px"
          }
        },
        "&.wv-option__left": {
          color: "#666",
          textDecoration: "none"
        }
      }
    }
  }
};

// src/elements/product-list/product-card-info.tsx
import { jsx as jsx52, jsxs as jsxs34 } from "react/jsx-runtime";
function ProductCardInfo(props) {
  let { product, showProductOption, optionName, optionLimit } = props;
  let { title, price, compare_at_price, url } = product;
  let { money_format } = weaverseShopifyConfigs.shopData;
  return /* @__PURE__ */ jsxs34("div", { className: "wv-pcard__info", children: [
    /* @__PURE__ */ jsx52("a", { className: "wv-pcard__title", href: url, target: "_self", children: title }),
    /* @__PURE__ */ jsxs34("div", { className: "wv-pcard__prices", children: [
      /* @__PURE__ */ jsx52(
        "span",
        {
          className: "wv-pcard__price sale-price",
          dangerouslySetInnerHTML: { __html: formatMoney(price, money_format) },
          suppressHydrationWarning: true
        }
      ),
      compare_at_price && /* @__PURE__ */ jsx52(
        "s",
        {
          className: "wv-pcard__price compare-price",
          dangerouslySetInnerHTML: {
            __html: formatMoney(compare_at_price, money_format)
          },
          suppressHydrationWarning: true
        }
      )
    ] }),
    showProductOption && /* @__PURE__ */ jsx52(
      ProductCardOptions,
      {
        optionLimit,
        optionName,
        product
      }
    )
  ] });
}
var css35 = {
  "@desktop": {
    ".wv-pcard__info": {
      marginTop: "20px",
      textAlign: "center",
      ".wv-pcard__title": {
        marginBottom: "4px",
        color: "#222",
        textTransform: "uppercase",
        fontSize: "16px",
        lineHeight: "20px",
        fontWeight: "600",
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
          textUnderlineOffset: "3px"
        }
      },
      ".wv-pcard__prices": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        lineHeight: "1.5",
        color: "#000000",
        position: "relative",
        fontWeight: "500",
        fontSize: "16px",
        ".wv-pcard__price": {
          margin: "5px 0",
          "&.compare-price": {
            color: "rgba(33, 33, 33, .75)",
            marginLeft: "12px"
          }
        }
      },
      ...css34["@desktop"]
    }
  }
};

// src/elements/product-list/product-card-sale-badge.tsx
import { jsx as jsx53 } from "react/jsx-runtime";
function ProductCardSaleBadge() {
  return /* @__PURE__ */ jsx53("span", { className: "wv-pcard__sale-badge", children: "Sale" });
}
var css36 = {
  "@desktop": {
    ".wv-pcard__sale-badge": {
      position: "absolute",
      right: 12,
      top: 12,
      display: "flex",
      flexFlow: "row wrap",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
      padding: "4px 10px",
      letterSpacing: "1px",
      fontSize: 15,
      color: "#fff",
      lineHeight: 1,
      backgroundColor: "#a83d3d"
    }
  }
};

// src/elements/product-list/product-card.tsx
import { Fragment as Fragment8, jsx as jsx54, jsxs as jsxs35 } from "react/jsx-runtime";
function ProductCard(props) {
  let {
    product,
    imageAspectRatio,
    showSecondImageOnHover,
    showSaleBadge,
    showViewDetailsButton,
    viewDetailsButtonText,
    showQuickViewButton,
    showProductOption,
    optionName,
    optionLimit,
    className
  } = props;
  let { images, media, compare_at_price, aspect_ratio, url } = product;
  let style = {
    "--image-aspect-ratio": imageAspectRatio === "auto" ? aspect_ratio || "auto" : imageAspectRatio
  };
  let isRecommendedProduct = Array.isArray(media);
  let imageSource = isRecommendedProduct ? media : images;
  let mainImage = imageSource[0];
  let secondImage = imageSource[1];
  let imagesClass = clsx_default(
    "wv-pcard__images",
    showSecondImageOnHover && secondImage && "show-second-image-on-hover"
  );
  let cardClass = clsx_default("wv-product-card", className);
  return /* @__PURE__ */ jsxs35("div", { className: cardClass, style, children: [
    /* @__PURE__ */ jsx54("div", { className: imagesClass, children: mainImage ? /* @__PURE__ */ jsxs35(Fragment8, { children: [
      /* @__PURE__ */ jsxs35("a", { href: url, target: "_self", children: [
        /* @__PURE__ */ jsx54(
          Image2,
          {
            className: "pcard-image main-image",
            image: mainImage,
            width: 500
          }
        ),
        showSecondImageOnHover && secondImage ? /* @__PURE__ */ jsx54(
          Image2,
          {
            className: "pcard-image secondary-image",
            image: secondImage,
            width: 500
          }
        ) : null
      ] }),
      /* @__PURE__ */ jsx54(
        ProductCardButtons,
        {
          product,
          showQuickViewButton,
          showViewDetailsButton,
          viewDetailsButtonText
        }
      ),
      showSaleBadge && compare_at_price && /* @__PURE__ */ jsx54(ProductCardSaleBadge, {})
    ] }) : null }),
    /* @__PURE__ */ jsx54(
      ProductCardInfo,
      {
        optionLimit,
        optionName,
        product,
        showProductOption
      }
    )
  ] });
}
var css37 = {
  "@desktop": {
    ".wv-product-card": {
      textDecoration: "none",
      padding: "16px",
      ".wv-pcard__images": {
        position: "relative",
        display: "block",
        width: "100%",
        overflow: "hidden",
        aspectRatio: "var(--image-aspect-ratio, auto)",
        ...css36["@desktop"],
        ".pcard-image": {
          width: "100%",
          height: "100%",
          cursor: "pointer",
          objectFit: "cover",
          "&.main-image": {
            transition: "opacity 1s ease",
            opacity: 1
          },
          "&.secondary-image": {
            position: "absolute",
            inset: 0,
            opacity: 0,
            visibility: "hidden",
            transform: "scale3d(1.08, 1.08, 1)",
            transition: ".75s cubic-bezier(0.4, 0, 0.2, 1)"
          }
        },
        "&.show-second-image-on-hover": {
          "&:hover": {
            ".main-image": {
              opacity: 0
            },
            ".secondary-image": {
              opacity: 1,
              visibility: "visible",
              transform: "scale3d(1, 1, 1)"
            }
          }
        },
        ...css33["@desktop"],
        "&:hover": {
          ".wv-pcard__buttons": {
            opacity: 1,
            transform: "translate3d(-50%, 0, 0)"
          }
        }
      },
      ...css35["@desktop"]
    }
  },
  "@mobile": {
    ".wv-product-card": {
      textDecoration: "none",
      width: "80vw",
      scrollSnapAlign: "start",
      flex: "0 0 auto",
      padding: "8px"
    }
  }
};

// src/elements/product-list/skeleton.tsx
import { Fragment as Fragment9, jsx as jsx55, jsxs as jsxs36 } from "react/jsx-runtime";
var { Icon: Icon8 } = Components;
function Skeleton3(props) {
  let { productCount, imageAspectRatio } = props;
  let aspectRatio = imageAspectRatio === "auto" ? "1/1" : imageAspectRatio;
  let style = {
    "--image-aspect-ratio": aspectRatio
  };
  return /* @__PURE__ */ jsx55(Fragment9, { children: Array.from({ length: productCount }).map((_, index) => /* @__PURE__ */ jsxs36(
    "div",
    {
      className: "wv-pcard-skeleton animate-pulse",
      style,
      children: [
        /* @__PURE__ */ jsx55("div", { className: "wv-pcard-skeleton__image", children: /* @__PURE__ */ jsx55(Icon8, { name: "Backpack" }) }),
        /* @__PURE__ */ jsxs36("div", { className: "wv-pcard-skeleton__price", children: [
          /* @__PURE__ */ jsx55("div", { className: "wv-pcard-skeleton__price-value" }),
          /* @__PURE__ */ jsx55("div", { className: "wv-pcard-skeleton__price-value" })
        ] }),
        /* @__PURE__ */ jsx55("div", { className: "wv-pcard-skeleton__title" }),
        /* @__PURE__ */ jsxs36("div", { className: "wv-pcard-skeleton__options", children: [
          /* @__PURE__ */ jsx55("div", { className: "wv-pcard-skeleton__option-value" }),
          /* @__PURE__ */ jsx55("div", { className: "wv-pcard-skeleton__option-value" }),
          /* @__PURE__ */ jsx55("div", { className: "wv-pcard-skeleton__option-value" }),
          /* @__PURE__ */ jsx55("div", { className: "wv-pcard-skeleton__option-value" })
        ] })
      ]
    },
    index
  )) });
}
var css38 = {
  "@desktop": {
    ".wv-pcard-skeleton": {
      display: "block",
      width: "100%",
      padding: "16px",
      ".wv-pcard-skeleton__image": {
        aspectRatio: "var(--image-aspect-ratio, auto)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D1D5DB",
        borderRadius: "4px",
        svg: { width: "48px", height: "48px", color: "#FFFFFF" }
      },
      ".wv-pcard-skeleton__price": {
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        margin: "16px 0",
        ".wv-pcard-skeleton__price-value": {
          display: "block",
          height: "12px",
          backgroundColor: "#D1D5DB",
          borderRadius: "2px",
          width: "30%"
        }
      },
      ".wv-pcard-skeleton__title": {
        display: "block",
        height: "20px",
        backgroundColor: "#D1D5DB",
        borderRadius: "4px",
        margin: "12px auto",
        width: "80%"
      },
      ".wv-pcard-skeleton__options": {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "8px",
        margin: "12px 0",
        ".wv-pcard-skeleton__option-value": {
          display: "block",
          height: "24px",
          width: "24px",
          backgroundColor: "#D1D5DB",
          borderRadius: "100%"
        }
      }
    }
  },
  "@mobile": {
    ".wv-pcard-skeleton": {
      textDecoration: "none",
      width: "80vw",
      scrollSnapAlign: "start",
      flex: "0 0 auto",
      padding: "8px"
    }
  }
};

// src/elements/product-list/use-products.ts
import React7, { useEffect as useEffect10 } from "react";
function useProducts(input) {
  let { source, collectionId, fixedProducts, isDesignMode } = input;
  let [recommendedProducts, setRecommendedProducts] = React7.useState([]);
  let products = [];
  if (source === "collection") {
    let productsByCollection = weaverseShopifyProductsByCollection[collectionId] || [];
    products = productsByCollection.map((pId) => weaverseShopifyProducts[pId]);
  }
  if (source === "recommended" && isDesignMode) {
    let productsByCollection = weaverseShopifyProductsByCollection.all || [];
    products = productsByCollection.map((pId) => weaverseShopifyProducts[pId]);
  }
  if (source === "fixedProducts" && fixedProducts?.length) {
    let _products = fixedProducts.map(
      ({ productId }) => weaverseShopifyProducts[productId]
    );
    let hasAllProducts = _products.every((p) => p);
    products = hasAllProducts ? _products : [];
  }
  useEffect10(() => {
    if (source === "recommended" && !isDesignMode) {
      let { product_id, routes } = window.weaverseShopifyConfigs.shopData;
      fetch(`${routes.product_recommendations_url}?product_id=${product_id}`).then((res) => res.json()).then((data) => {
        if (data.status === 404 || data.status === 422) {
          throw new Error(`${data.message} - (${data.description})`);
        }
        setRecommendedProducts(data.products);
        for (let p of data.products) {
          if (!weaverseShopifyProducts[p.id]) {
            weaverseShopifyProducts[p.id] = {
              ...p,
              images: p.media,
              has_only_default_variant: p.variants.length === 1 && p.variants[0].title === "Default Title",
              selected_or_first_available_variant: p.variants.find((v) => v.available) || null
            };
          }
        }
      }).catch((err) => {
        console.log("\u274C Error fetching recommended products", err);
      });
    }
  }, []);
  return source === "recommended" && !isDesignMode ? recommendedProducts : products;
}

// src/elements/product-list/index.tsx
import { jsx as jsx56 } from "react/jsx-runtime";
var { Placeholder: Placeholder7, Slider: Slider4 } = Components;
var ProductList = forwardRef26((props, ref) => {
  let {
    source,
    collectionId,
    collectionHandle,
    fixedProducts,
    layout,
    productCount,
    productsPerRow,
    gap,
    imageAspectRatio,
    showSecondImageOnHover,
    showSaleBadge,
    showViewDetailsButton,
    viewDetailsButtonText,
    showQuickViewButton,
    showProductOption,
    optionName,
    optionLimit,
    children,
    ...rest
  } = props;
  let { ssrMode, isDesignMode } = useWeaverseShopify();
  let products = useProducts({
    source,
    collectionId,
    fixedProducts,
    isDesignMode
  });
  let mainProductId = 0;
  if (!(ssrMode || isDesignMode)) {
    mainProductId = window.weaverseShopifyConfigs.shopData.product_id;
  }
  let shouldShowPlaceholder = source === "collection" && !collectionId || source === "fixedProducts" && !fixedProducts?.length || source === "recommended" && !ssrMode && !isDesignMode && !mainProductId;
  if (shouldShowPlaceholder) {
    let placeholderText = "Select a collection and start editing.";
    if (source === "fixedProducts") {
      placeholderText = "Select products and start editing.";
    }
    if (source === "recommended") {
      placeholderText = "Recommended Product List must be used on a product page.";
    }
    return /* @__PURE__ */ jsx56("div", { ref, ...rest, children: /* @__PURE__ */ jsx56(Placeholder7, { element: "Product List", children: placeholderText }) });
  }
  let totalProducts = source === "fixedProducts" ? fixedProducts.length : productCount;
  let rows = Math.ceil(totalProducts / productsPerRow);
  let shouldRenderSkeleton = ssrMode || !products.length;
  let display = "grid";
  let overflow = "hidden";
  if (!shouldRenderSkeleton && layout === "slider") {
    display = "block";
    overflow = "0";
  }
  let style = {
    "--display": display,
    "--overflow": overflow,
    "--gap": `${gap}px`,
    "--product-per-row": productsPerRow,
    "--rows": rows
  };
  if (shouldRenderSkeleton) {
    return /* @__PURE__ */ jsx56("div", { ref, ...rest, style, children: /* @__PURE__ */ jsx56(
      Skeleton3,
      {
        imageAspectRatio,
        productCount: layout === "slider" ? productsPerRow : productCount
      }
    ) });
  }
  let productCards = products.filter((p) => p && p.id !== mainProductId).slice(0, productCount).map((product) => /* @__PURE__ */ jsx56(
    ProductCard,
    {
      className: layout === "slider" ? "keen-slider__slide" : "",
      imageAspectRatio,
      optionLimit,
      optionName,
      product,
      showProductOption,
      showQuickViewButton,
      showSaleBadge,
      showSecondImageOnHover,
      showViewDetailsButton,
      viewDetailsButtonText
    },
    product.id
  ));
  if (layout === "slider") {
    return /* @__PURE__ */ jsx56("div", { ref, ...rest, style, children: /* @__PURE__ */ jsx56(
      Slider4,
      {
        arrowOffset: -80,
        className: "wv-product-list__slider",
        gap,
        slidesPerView: productsPerRow,
        children: productCards
      }
    ) });
  }
  return /* @__PURE__ */ jsx56("div", { ref, ...rest, style, children: productCards });
});
var product_list_default = ProductList;
ProductList.defaultProps = {
  source: "collection",
  layout: "grid",
  productCount: 8,
  productsPerRow: 4,
  gap: 16,
  imageAspectRatio: "auto",
  showSecondImageOnHover: true,
  showViewDetailsButton: true,
  viewDetailsButtonText: "View details",
  showQuickViewButton: true,
  showSaleBadge: true,
  showProductOption: true,
  optionName: "Color",
  optionLimit: 4
};
var css39 = {
  "@desktop": {
    display: "var(--display, grid)",
    gridTemplateColumns: "repeat(var(--product-per-row), 1fr)",
    gap: "var(--gap, 16px)",
    overflow: "var(--overflow, hidden)",
    position: "relative",
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "repeat(var(--rows), 1fr) 0"
    },
    ...css37["@desktop"],
    ...css38["@desktop"]
  },
  "@mobile": {
    display: "flex",
    overflow: "auto",
    scrollBehavior: "smooth",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 0,
    ".wv-product-list__slider": {
      ".wv-product-card": {
        padding: "0 32px"
      }
    },
    ...css37["@mobile"],
    ...css38["@mobile"]
  }
};

// src/elements/scrolling-text.tsx
import React8, { useState as useState9 } from "react";
import { jsx as jsx57 } from "react/jsx-runtime";
var ScrollingText = React8.forwardRef((props, ref) => {
  let { children, value, gap, speed, pauseOnHover, ...rest } = props;
  let [playState, setPlayState] = useState9("running");
  let style = {
    "--gap": `${gap}px`,
    "--speed": `${speed}s`,
    "--play-state": playState
  };
  let events = {};
  if (pauseOnHover) {
    events = {
      onMouseEnter: () => setPlayState("paused"),
      onMouseLeave: () => setPlayState("running")
    };
  }
  return /* @__PURE__ */ jsx57("div", { ref, ...rest, children: /* @__PURE__ */ jsx57("div", { className: "wv-scrolling-text__container", style, ...events, children: Array.from({ length: 30 }).map((_, i) => /* @__PURE__ */ jsx57(
    "div",
    {
      className: "wv-text-content",
      dangerouslySetInnerHTML: { __html: value }
    },
    i
  )) }) });
});
var css40 = {
  "@desktop": {
    display: "flex",
    padding: "10px",
    overflow: "hidden",
    ".wv-scrolling-text__container": {
      visibility: "visible",
      whiteSpace: "nowrap",
      display: "flex",
      gap: "var(--gap, 40px)",
      animation: "wv-scrolling-text var(--speed, 100s) linear infinite",
      animationPlayState: "var(--play-state, running)",
      ".wv-text-content": {
        width: "100%",
        height: "fit-content",
        "> p, > h1, > h2, > h3, > h4, > h5, > h6": {
          all: "inherit",
          margin: "0",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          width: "auto",
          height: "auto"
        }
      }
    }
  }
};
ScrollingText.defaultProps = {
  value: "<p>The quick brown fox jumps over the lazy dog</p>",
  gap: 40,
  speed: 200,
  pauseOnHover: true
};
var scrolling_text_default = ScrollingText;

// src/elements/slideshow/index.tsx
import { css as stitchesCss } from "@stitches/react";
import { forwardRef as forwardRef27 } from "react";

// src/elements/slideshow/use-slideshow-configs.ts
import { WeaverseContext as WeaverseContext11 } from "@weaverse/react";
import { useKeenSlider as useKeenSlider4 } from "keen-slider/react";
import React9, { useContext as useContext12, useEffect as useEffect11, useState as useState10 } from "react";
function useSlideshowConfigs(props) {
  let {
    animation,
    slidesPerView,
    loop,
    autoRotate,
    changeSlidesEvery,
    children
  } = props;
  let { isDesignMode, isPreviewMode } = useContext12(WeaverseContext11);
  let [opacities, setOpacities] = React9.useState([]);
  let [cssLoaded, setCssLoaded] = useState10(false);
  let [created, setCreated] = useState10(false);
  let [ready, setReady] = useState10(false);
  let [currentSlide, setCurrentSlide] = useState10(0);
  let sliderPlugins = [ResizePlugin];
  if (autoRotate && (isPreviewMode || !isDesignMode)) {
    sliderPlugins.push(AutoplayPlugin(changeSlidesEvery));
  }
  let [sliderRef, instanceRef] = useKeenSlider4(
    {
      slides: animation === "fade" ? React9.Children.count(children) : { perView: slidesPerView, number: React9.Children.count(children) },
      drag: isPreviewMode || !isDesignMode,
      loop,
      selector: animation === "fade" ? null : ".keen-slider__slide",
      created: (slider) => {
        setCreated(true);
        if (isDesignMode) {
          let slideshowElement = slider.container.closest(
            '[data-wv-type="slideshow"]'
          );
          let elementId = slideshowElement?.getAttribute("data-wv-id");
          if (elementId) {
            window.weaverseSlideshowInstances = {
              [elementId]: slider
            };
          }
        }
      },
      slideChanged: (slider) => {
        setCurrentSlide(slider.track.details.rel);
      },
      detailsChanged: (slider) => {
        let newOpacities = slider.track?.details?.slides?.map(
          (slide) => slide.portion
        );
        setOpacities(newOpacities);
      }
    },
    sliderPlugins
  );
  useEffect11(() => {
    loadCSS({
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css"
    }).then(() => setCssLoaded(true));
  }, []);
  useEffect11(() => {
    if (created && cssLoaded) {
      setReady(true);
    }
  }, [created, cssLoaded]);
  return {
    sliderRef,
    instanceRef,
    currentSlide,
    opacities,
    ready,
    created
  };
}

// src/elements/slideshow/index.tsx
import { jsx as jsx58, jsxs as jsxs37 } from "react/jsx-runtime";
var Slideshow = forwardRef27((props, ref) => {
  let {
    animation,
    showArrows,
    showArrowsOnHover,
    arrowIcon,
    arrowsColor,
    showDots,
    dotsPosition,
    dotsColor,
    children,
    ...rest
  } = props;
  let { sliderRef, instanceRef, currentSlide, opacities, ready, created } = useSlideshowConfigs(props);
  let style = {
    "--slider-opacity": ready ? 1 : 0
  };
  let faderClass = "";
  if (animation === "fade") {
    faderClass = stitchesCss({
      ".keen-slider__slide": opacities.reduce((acc, opacity, index) => {
        acc[`&:nth-child(${index + 1})`] = {
          opacity,
          display: opacity === 0 ? "none" : "block"
        };
        return acc;
      }, {})
    })().className;
  }
  let _className = clsx_default(
    faderClass,
    animation === "slide" ? "keen-slider" : "keen-fader"
  );
  let arrowsClass = clsx_default(
    "wv-slideshow--arrows",
    showArrowsOnHover && "show-on-hover",
    `arrows--${arrowsColor}`
  );
  return /* @__PURE__ */ jsxs37("div", { ref, ...rest, style, children: [
    /* @__PURE__ */ jsx58("div", { className: _className, ref: sliderRef, children }),
    showArrows && created && instanceRef?.current && /* @__PURE__ */ jsx58(
      Arrows,
      {
        className: arrowsClass,
        currentSlide,
        icon: arrowIcon,
        instanceRef,
        offset: 20
      }
    ),
    showDots && created && instanceRef?.current && /* @__PURE__ */ jsx58(
      Dots,
      {
        absolute: true,
        className: "wv-slideshow--dots",
        color: dotsColor,
        currentSlide,
        instanceRef,
        position: dotsPosition
      }
    )
  ] });
});
var css41 = {
  "@desktop": {
    opacity: "var(--slider-opacity, 0)",
    padding: "32px 0",
    position: "relative",
    ".keen-slider": {
      height: "100%"
    },
    ".keen-fader": {
      position: "relative",
      height: "100%",
      ".keen-slider__slide": {
        position: "absolute",
        inset: 0
      }
    },
    ".wv-slideshow--arrows": {
      ".arrow": {
        borderRadius: "100%",
        backgroundColor: "transparent",
        padding: "6px",
        "&:hover": {
          backgroundColor: "#fff"
        },
        svg: {
          width: "28px",
          height: "28px"
        }
      },
      "&.show-on-hover": {
        opacity: 0,
        transition: "opacity 0.3s ease"
      },
      "&.arrows--dark": {
        ".arrow": {
          color: "#000"
        }
      },
      "&.arrows--light": {
        ".arrow": {
          color: "#fff"
        }
      }
    },
    "&:hover": {
      ".wv-slideshow--arrows": {
        opacity: 1
      }
    }
  }
};
Slideshow.defaultProps = {
  animation: "slide",
  slidesPerView: 1,
  spacing: 0,
  showArrows: true,
  showArrowsOnHover: false,
  arrowIcon: "caret",
  arrowsColor: "dark",
  showDots: true,
  dotsPosition: "bottom",
  dotsColor: "dark",
  loop: true,
  autoRotate: false,
  changeSlidesEvery: 5
};
var slideshow_default = Slideshow;

// src/elements/slideshow/slide.tsx
import { forwardRef as forwardRef28 } from "react";

// src/elements/slideshow/position.ts
var slidePositionMap = {
  "top left": {
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  "top center": {
    justifyContent: "flex-start",
    alignItems: "center"
  },
  "top right": {
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  "center left": {
    justifyContent: "center",
    alignItems: "flex-start"
  },
  "center center": {
    justifyContent: "center",
    alignItems: "center"
  },
  "center right": {
    justifyContent: "center",
    alignItems: "flex-end"
  },
  "bottom left": {
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  "bottom center": {
    justifyContent: "flex-end",
    alignItems: "center"
  },
  "bottom right": {
    justifyContent: "flex-end",
    alignItems: "flex-end"
  }
};

// src/elements/slideshow/slide.tsx
import { jsx as jsx59, jsxs as jsxs38 } from "react/jsx-runtime";
var Slide = forwardRef28((props, ref) => {
  let {
    contentPosition,
    backgroundColor,
    backgroundImage,
    objectFit,
    objectPosition,
    enableOverlay,
    overlayOpacity,
    backgroundFit,
    backgroundPosition,
    children,
    ...rest
  } = props;
  return /* @__PURE__ */ jsxs38("div", { className: "keen-slider__slide", children: [
    /* @__PURE__ */ jsx59(
      Background,
      {
        backgroundColor,
        backgroundFit: objectFit,
        backgroundImage,
        backgroundPosition: objectPosition,
        className: "slide-background"
      }
    ),
    /* @__PURE__ */ jsx59(
      Overlay2,
      {
        className: "slide-overlay",
        enableOverlay,
        overlayOpacity
      }
    ),
    /* @__PURE__ */ jsx59("div", { ref, ...rest, style: slidePositionMap[contentPosition], children: children?.length ? children : /* @__PURE__ */ jsx59(placeholder_default, { className: "wv-slide-placeholder", element: "Slide", children: "Drag and drop elements here" }) })
  ] });
});
var css42 = {
  "@desktop": {
    position: "relative",
    height: "100%",
    width: "1224px",
    maxWidth: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    padding: "100px 20px",
    ".wv-slide-placeholder": {
      height: "200px",
      zIndex: 1
    }
  }
};
Slide.defaultProps = {
  contentPosition: "center center",
  objectFit: "cover",
  objectPosition: "center center",
  enableOverlay: false,
  overlayOpacity: 30
};
var slide_default = Slide;

// src/elements/text.tsx
import * as React10 from "react";
import { jsx as jsx60 } from "react/jsx-runtime";
var Text = React10.forwardRef(
  (props, ref) => {
    let { children, value, ...rest } = props;
    return /* @__PURE__ */ jsx60("div", { ref, ...rest, children: /* @__PURE__ */ jsx60(
      "div",
      {
        className: "wv-text-content",
        dangerouslySetInnerHTML: { __html: value }
      }
    ) });
  }
);
var css43 = {
  "@desktop": {
    display: "flex",
    padding: "10px",
    overflow: "hidden",
    ".wv-text-content": {
      width: "100%",
      height: "fit-content",
      "> p, > h1, > h2, > h3, > h4, > h5, > h6": {
        all: "inherit",
        margin: "0",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        width: "auto",
        height: "auto"
      }
    }
  }
};
Text.defaultProps = {
  value: "<p>The quick brown fox jumps over the lazy dog</p>"
};
var text_default = Text;

// src/elements/video/index.tsx
import { WeaverseContext as WeaverseContext12 } from "@weaverse/react";
import { forwardRef as forwardRef30, useContext as useContext13 } from "react";

// src/elements/video/html-video.tsx
import { jsx as jsx61, jsxs as jsxs39 } from "react/jsx-runtime";
function HTMLVideo(props) {
  let { src, type, controls, autoPlay, loop, muted } = props;
  return /* @__PURE__ */ jsxs39(
    "video",
    {
      autoPlay,
      controls,
      controlsList: "nodownload",
      disablePictureInPicture: true,
      loop,
      muted,
      children: [
        /* @__PURE__ */ jsx61("source", { src, type: type || "video/mp4" }),
        /* @__PURE__ */ jsx61("source", { src, type: "video/ogg" }),
        "Your browser does not support the video tag."
      ]
    }
  );
}

// src/elements/video/vimeo.tsx
import { jsx as jsx62 } from "react/jsx-runtime";
function Vimeo(props) {
  let { vimeoId, controls, autoPlay, loop, muted } = props;
  let params = `autoplay=${autoPlay}&loop=${loop}&controls=${controls}&muted=${muted}`;
  let vimeoSrc = `https://player.vimeo.com/video/${vimeoId}?${params}`;
  return /* @__PURE__ */ jsx62(
    "iframe",
    {
      allowFullScreen: true,
      height: "100%",
      src: vimeoSrc,
      title: "Vimeo embed video",
      width: "100%"
    }
  );
}

// src/elements/video/youtube.tsx
import { jsx as jsx63 } from "react/jsx-runtime";
function Youtube(props) {
  let { youtubeId, controls, autoPlay, loop, muted } = props;
  let params = new URLSearchParams({
    autoplay: autoPlay ? "1" : "0",
    controls: controls ? "1" : "0",
    loop: loop ? "1" : "0",
    mute: muted ? "1" : "0"
  });
  let youtubeSrc = `https://www.youtube.com/embed/${youtubeId}?playlist=${youtubeId}&${params.toString()}`;
  let allow = `accelerometer;${autoPlay ? "autoplay;" : ""} clipboard-write; encrypted-media; gyroscope; picture-in-picture`;
  return /* @__PURE__ */ jsx63(
    "iframe",
    {
      allow,
      height: "100%",
      src: youtubeSrc,
      title: "Youtube embed video",
      width: "100%"
    }
  );
}

// src/elements/video/index.tsx
import { jsx as jsx64 } from "react/jsx-runtime";
var Video = forwardRef30((props, ref) => {
  let { isDesignMode } = useContext13(WeaverseContext12);
  let {
    src,
    controls,
    poster,
    autoPlay: originAutoPlay,
    loop,
    muted,
    ...rest
  } = props;
  let autoPlay = !isDesignMode && originAutoPlay;
  let videoProps = { src, controls, poster, autoPlay, loop, muted };
  let content;
  let youtubeId = getYoutubeEmbedId(src);
  let vimeoId = getVimeoId(src);
  if (youtubeId) {
    content = /* @__PURE__ */ jsx64(Youtube, { ...videoProps, youtubeId });
  } else if (vimeoId) {
    content = /* @__PURE__ */ jsx64(Vimeo, { ...videoProps, vimeoId });
  } else {
    content = /* @__PURE__ */ jsx64(HTMLVideo, { ...videoProps });
  }
  return /* @__PURE__ */ jsx64("div", { ref, ...rest, children: content });
});
var css44 = {
  "@desktop": {
    video: {
      height: "100%",
      width: "100%",
      aspectRatio: "16 / 9"
    },
    iframe: {
      border: "none"
    }
  },
  "@mobile": {
    iframe: {
      border: "none"
    }
  }
};
Video.defaultProps = {
  src: "https://youtu.be/wM-NT6hcw48",
  poster: "https://ucarecdn.com/c413b8fe-ceec-4948-9c42-a0434c4ca920/-/preview/-/quality/smart/-/format/auto/",
  loop: false,
  controls: false,
  autoPlay: true,
  muted: true
};
var video_default = Video;

// src/elements/index.ts
var SHOPIFY_ELEMENTS = {
  ...productElements,
  ArticleList: {
    Component: article_list_default,
    type: "article-list",
    defaultCss: css4
  },
  CollectionList: {
    Component: collection_list_default,
    type: "collection-list",
    defaultCss: css7
  },
  Form: {
    Component: form_default,
    type: "form",
    defaultCss: css13
  },
  CustomHTML: {
    Component: custom_html_default,
    type: "custom.html",
    defaultCss: css12
  },
  Hotspots: {
    Component: hotspots_default,
    type: "hotspots",
    defaultCss: css14
  },
  ProductList: {
    Component: product_list_default,
    type: "product-list",
    defaultCss: css39
  },
  AppBlock: {
    Component: app_block_default,
    type: "app-block",
    defaultCss: css8
  },
  Countdown: {
    Component: countdown_default,
    type: "countdown",
    defaultCss: css11
  },
  Button: {
    Component: button_default,
    type: "button",
    defaultCss: css9
  },
  Container: {
    Component: container_default,
    type: "container",
    defaultCss: css10
  },
  Image: {
    Component: image_default,
    type: "image",
    defaultCss: css15
  },
  Instagram: {
    Component: instagram_default,
    type: "instagram",
    defaultCss: css16,
    permanentCss
  },
  Layout: {
    Component: layout_default,
    type: "layout",
    defaultCss: css17
  },
  Map: {
    Component: map_default,
    type: "map",
    defaultCss: css18
  },
  Text: {
    Component: text_default,
    type: "text",
    defaultCss: css43
  },
  ScrollingText: {
    Component: scrolling_text_default,
    type: "scrolling-text",
    defaultCss: css40
  },
  Video: {
    Component: video_default,
    type: "video",
    defaultCss: css44
  },
  Slideshow: {
    Component: slideshow_default,
    type: "slideshow",
    defaultCss: css41
  },
  Slide: {
    Component: slide_default,
    type: "slide",
    defaultCss: css42
  }
};

// src/utils/fetch-project-data.ts
async function fetchProjectData({
  fetch: fetch2 = globalThis.fetch,
  weaverseHost,
  sectionId,
  isDesignMode,
  timestamp
}) {
  let data;
  if (timestamp && !isDesignMode) {
    data = localStorage.getItem(`weaverse-${sectionId}-${timestamp}`);
    if (data) {
      return JSON.parse(data);
    }
  }
  let params = new URLSearchParams();
  timestamp && params.append("timestamp", timestamp.toString());
  isDesignMode && params.append("isDesignMode", "true");
  let paramString = params.toString();
  data = await fetch2(
    `${weaverseHost}/api/public/section?id=${sectionId}${paramString ? `&${paramString}` : ""}`
  ).then((res) => res.json()).catch((err) => console.log("Error fetching project data:", err));
  if (data) {
    if (timestamp && !isDesignMode) {
      localStorage.setItem(
        `weaverse-${sectionId}-${timestamp}`,
        JSON.stringify(data)
      );
    }
    return data;
  }
}

// src/WeaverseShopifyRoot.tsx
import { WeaverseRoot } from "@weaverse/react";

// src/hooks/use-studio.ts
import { isIframe, loadScript } from "@weaverse/react";
import { useEffect as useEffect12 } from "react";
function useStudio(weaverse) {
  useEffect12(() => {
    let { isDesignMode, weaverseHost, weaverseVersion } = weaverse;
    if (isDesignMode && isIframe && !window.weaverseStudio) {
      let version = weaverseVersion || Date.now();
      let studioScriptSrc = `${weaverseHost}/static/studio/studio-bridge.js?v=${version}`;
      loadScript(studioScriptSrc).then(() => window?.createWeaverseStudioBridge(weaverse)).catch(console.error);
    }
  }, []);
}

// src/WeaverseShopifyRoot.tsx
import { jsx as jsx65 } from "react/jsx-runtime";
function createWeaverseShopify(params) {
  registerShopifyElements();
  return new WeaverseShopify(params);
}
function ShopifyRoot({ context }) {
  useStudio(context);
  return /* @__PURE__ */ jsx65(WeaverseRoot, { context });
}

// src/index.ts
var registerThirdPartyElements = () => {
  WeaverseShopify.integrations?.flatMap(({ elements }) => elements).forEach(({ type, extraData }) => {
    WeaverseShopify.registerElement({
      type,
      extraData,
      Component: third_party_default,
      defaultCss: css
    });
  });
};
var registerShopifyElements = () => {
  Object.values(SHOPIFY_ELEMENTS).forEach((elm) => {
    WeaverseShopify.registerElement(elm);
  });
  registerThirdPartyElements();
};
var WeaverseShopify = class _WeaverseShopify extends Weaverse {
  platformType = "shopify-section";
  static integrations;
  elementSchemas;
  ssrMode;
  constructor(params) {
    let { thirdPartyIntegration, elementSchemas, ssrMode, ...coreParams } = params;
    super({ ...coreParams, platformType: "shopify-section" });
    this.elementSchemas = elementSchemas || [];
    this.ssrMode = ssrMode ?? false;
    _WeaverseShopify.integrations = thirdPartyIntegration || DEFAULT_INTEGRATIONS;
  }
};
var WeaverseShopifyItem = class extends WeaverseItemStore {
  constructor(initialData, weaverse) {
    super(initialData, weaverse);
    let defaultData = this.Element?.Component?.defaultProps || {};
    let extraData = this.Element?.extraData;
    Object.assign(this._store, defaultData, extraData, initialData);
  }
  get Element() {
    return super.Element;
  }
  get _flags() {
    return this.Element?.schema?.flags || {};
  }
};
Weaverse.ItemConstructor = WeaverseShopifyItem;
export {
  ShopifyRoot,
  WeaverseShopify,
  WeaverseShopifyItem,
  createWeaverseShopify,
  fetchProjectData,
  registerShopifyElements,
  registerThirdPartyElements
};
//# sourceMappingURL=index.mjs.map