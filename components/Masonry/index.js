import React from "react";

export default function Masonry({
  breaks = [
    ["default", 1],
    ["sm", 2],
    ["lg", 3],
    ["xl", 4],
  ],
  children,
}) {
  return (
    <div className="container m-auto">
      <div className="flex flex-row">
        {breaks.map(([sz, cols]) => {
          return Array(cols)
            .fill()
            .map((_, cnt) => {
              const cells = children.filter((_, idx) => {
                return idx % cols === cnt;
              });

              if (children.length > 0 && cells.length === 0) {
                cells.push(<div className="invisible">{children[0]}</div>);
              }

              return (
                <div
                  className={`${
                    sz === "default" ? "flex" : "hidden"
                  } w-full flex-col space-y-4 ${
                    cnt === cols - 1 ? "" : "pr-4"
                  } ${breaks
                    .map((b) => b[0])
                    .filter((k) => k !== "default")
                    .map((k) => (k === sz ? `${sz}:flex` : `${k}:hidden`))
                    .join(" ")}`}
                  key={cnt}
                >
                  {cells}
                </div>
              );
            });
        })}
      </div>
    </div>
  );
}
