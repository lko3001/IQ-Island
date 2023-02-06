import React from "react";

type Styles = {
  styleProp: { transition?: string; backgroundPosition?: string };
};

export default function Time({ styleProp }: Styles) {
  return <div className="h-4 black-shadow w-full time" style={styleProp}></div>;
}
